<script lang="ts">
  import {
    Body,
    Button,
    Heading,
    Icon,
    Input,
    Layout,
    Modal,
    ModalContent,
    notifications,
    TextArea,
    Toggle,
  } from "@budibase/bbui"
  import { agentsStore } from "@/stores/portal"
  import Chatbox from "./Chatbox.svelte"
  import type {
    AgentChat,
    AgentToolSourceWithTools,
    CreateToolSourceRequest,
    UserMessage,
  } from "@budibase/types"
  import { onDestroy, onMount } from "svelte"
  import { type ComponentType } from "svelte"
  import Panel from "@/components/design/Panel.svelte"
  import { API } from "@/api"
  import BudibaseLogo from "./logos/Budibase.svelte"
  import GithubLogo from "./logos/Github.svelte"
  import ConfluenceLogo from "./logos/Confluence.svelte"
  import BambooHRLogo from "./logos/BambooHR.svelte"
  import TopBar from "@/components/common/TopBar.svelte"

  const Logos: Record<string, ComponentType> = {
    BUDIBASE: BudibaseLogo,
    CONFLUENCE: ConfluenceLogo,
    GITHUB: GithubLogo,
    BAMBOOHR: BambooHRLogo,
  }

  const ToolSources = [
    {
      name: "Budibase",
      type: "BUDIBASE",
      description: "Connect agent to your Budibase tools",
    },
    {
      name: "Github",
      type: "GITHUB",
      description: "Automate development workflows.",
    },
    {
      name: "Confluence",
      type: "CONFLUENCE",
      description: "Connect agent to your teams documentation",
    },
    {
      name: "Sharepoint",
      type: "SHAREPOINT",
      description: "Sharepoint stuff",
    },
    {
      name: "JIRA Service Manaagement",
      type: "JIRA_SM",
      description: "Automate ITSM Workflows",
    },
    {
      name: "BambooHR",
      type: "BAMBOOHR",
      description: "Automate HR workflows and employee management",
    },
  ]

  let inputValue = ""
  let chat: AgentChat = { title: "", messages: [] }
  let loading: boolean = false
  let chatAreaElement: HTMLDivElement
  let observer: MutationObserver
  let textareaElement: HTMLTextAreaElement
  let toolSourceModal: Modal
  let toolConfigModal: Modal
  let deleteConfirmModal: Modal
  let selectedToolSource: any = null
  let selectedConfigToolSource: any = null
  let toolSourceToDelete: any = null
  let panelView: "tools" | "toolConfig" = "tools"
  let toolConfig: Record<string, string> = {}
  let toolConfigChanged = false

  $: chatHistory = $agentsStore.chats || []
  $: toolSources = $agentsStore.toolSources || []

  import { tick } from "svelte"
  import NavHeader from "@/components/common/NavHeader.svelte"
  import InfoDisplay from "@/pages/builder/workspace/[application]/design/[workspaceAppId]/[screenId]/[componentId]/_components/Component/InfoDisplay.svelte"
  import NavItem from "@/components/common/NavItem.svelte"
  import { contextMenuStore } from "@/stores/builder"

  $: if (chat.messages.length) {
    scrollToBottom()
  }

  async function scrollToBottom() {
    await tick()
    if (chatAreaElement) {
      chatAreaElement.scrollTop = chatAreaElement.scrollHeight
    }
  }

  async function handleKeyDown(event: any) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      await prompt()
    }
  }

  async function prompt() {
    if (!chat) {
      chat = { title: "", messages: [] }
    }

    const userMessage: UserMessage = { role: "user", content: inputValue }

    const updatedChat = {
      ...chat,
      messages: [...chat.messages, userMessage],
    }

    // Update local display immediately with user message
    chat = updatedChat

    // Ensure we scroll to the new message
    await scrollToBottom()

    inputValue = ""
    loading = true

    let streamingContent = ""
    let isToolCall = false
    let toolCallInfo: string = ""

    try {
      await API.agentChatStream(
        updatedChat,
        chunk => {
          if (chunk.type === "content") {
            // Accumulate streaming content
            streamingContent += chunk.content || ""

            // Update chat with partial content
            const updatedMessages = [...updatedChat.messages]

            // Find or create assistant message
            const lastMessage = updatedMessages[updatedMessages.length - 1]
            if (lastMessage?.role === "assistant") {
              lastMessage.content =
                streamingContent + (isToolCall ? toolCallInfo : "")
            } else {
              updatedMessages.push({
                role: "assistant",
                content: streamingContent + (isToolCall ? toolCallInfo : ""),
              })
            }

            chat = {
              ...chat,
              messages: updatedMessages,
            }

            // Auto-scroll as content streams
            scrollToBottom()
          } else if (chunk.type === "tool_call_start") {
            isToolCall = true
            toolCallInfo = `\n\n**🔧 Executing Tool:** ${chunk.toolCall?.name}\n**Parameters:**\n\`\`\`json\n${chunk.toolCall?.arguments}\n\`\`\`\n`

            const updatedMessages = [...updatedChat.messages]
            const lastMessage = updatedMessages[updatedMessages.length - 1]
            if (lastMessage?.role === "assistant") {
              lastMessage.content = streamingContent + toolCallInfo
            } else {
              updatedMessages.push({
                role: "assistant",
                content: streamingContent + toolCallInfo,
              })
            }

            chat = {
              ...chat,
              messages: updatedMessages,
            }

            scrollToBottom()
          } else if (chunk.type === "tool_call_result") {
            const resultInfo = chunk.toolResult?.error
              ? `\n**❌ Tool Error:** ${chunk.toolResult.error}`
              : `\n**✅ Tool Result:** Complete`

            toolCallInfo += resultInfo

            const updatedMessages = [...updatedChat.messages]
            const lastMessage = updatedMessages[updatedMessages.length - 1]
            if (lastMessage?.role === "assistant") {
              lastMessage.content = streamingContent + toolCallInfo
            }

            chat = {
              ...chat,
              messages: updatedMessages,
            }

            scrollToBottom()
          } else if (chunk.type === "chat_saved") {
            // Update complete response
            if (chunk.chat) {
              chat = chunk.chat

              if (chunk.chat._id) {
                agentsStore.setCurrentChatId(chunk.chat._id)
                // Refresh chat history to include the new/updated chat
                agentsStore.fetchChats()
              }
            }

            loading = false
            scrollToBottom()
          } else if (chunk.type === "error") {
            notifications.error(chunk.content || "An error occurred")
            loading = false
          }
        },
        error => {
          console.error("Streaming error:", error)
          notifications.error(error.message)
          loading = false
        }
      )
    } catch (err: any) {
      console.error(err)
      notifications.error(err.message)
      loading = false
    }

    // Return focus to textarea after the response
    await tick()
    if (textareaElement) {
      textareaElement.focus()
    }
  }

  const selectChat = async (selectedChat: AgentChat) => {
    chat = { ...selectedChat }
    agentsStore.setCurrentChatId(selectedChat._id!)
    await scrollToBottom()
  }

  const startNewChat = () => {
    chat = { title: "", messages: [] }
    agentsStore.clearCurrentChatId()
  }

  const openToolConfig = (toolSource: any) => {
    selectedToolSource = toolSource
    toolConfig = {}
    toolSourceModal.hide()
    toolConfigModal.show()
  }

  const editToolSource = (toolSource: any) => {
    selectedToolSource = {
      ...ToolSources.find(ts => ts.type === toolSource.type),
      _id: toolSource._id,
      _rev: toolSource._rev,
      existingToolSource: toolSource,
    }
    toolConfig = { ...toolSource.auth }
    toolConfigModal.show()
  }

  const confirmDeleteToolSource = (toolSource: any) => {
    toolSourceToDelete = toolSource
    deleteConfirmModal.show()
  }

  const deleteToolSource = async () => {
    if (!toolSourceToDelete) return

    try {
      await agentsStore.deleteToolSource(toolSourceToDelete._id)
      notifications.success("Tool source deleted successfully.")
      deleteConfirmModal.hide()
      toolSourceToDelete = null
    } catch (err) {
      console.error(err)
      notifications.error("Error deleting tool source")
    }
  }

  const handleConfigBack = () => {
    toolConfigModal.hide()
    toolSourceModal.show()
  }

  const handleConfigSave = async () => {
    try {
      const authConfig = { ...toolConfig }

      if (selectedToolSource.existingToolSource) {
        // Update existing tool source
        const updatedToolSource = {
          ...selectedToolSource.existingToolSource,
          auth: authConfig,
        }
        await agentsStore.updateToolSource(updatedToolSource)
        notifications.success("Tool source updated successfully.")
      } else {
        // Create new tool source
        const toolSourceData: CreateToolSourceRequest = {
          type: selectedToolSource.type,
          disabledTools: [],
          auth: authConfig,
        }
        await agentsStore.createToolSource(toolSourceData)
        notifications.success("Tool source saved successfully.")
      }

      await agentsStore.fetchToolSources()
      toolConfigModal.hide()
    } catch (err: any) {
      console.error(err)
      const message = selectedToolSource.existingToolSource
        ? "Error updating tool source"
        : "Error saving tool source"
      notifications.error(`${message}: ${err.message}`)
    }
  }

  const openToolsConfig = (toolSource: any) => {
    selectedConfigToolSource = { ...toolSource }
    panelView = "toolConfig"
  }

  const backToToolsList = () => {
    panelView = "tools"
    selectedConfigToolSource = null
    toolConfigChanged = false
  }

  const toggleTool = (toolName: string) => {
    if (!selectedConfigToolSource) return

    const currentDisabled = selectedConfigToolSource.disabledTools || []
    const isDisabled = currentDisabled.includes(toolName)

    if (isDisabled) {
      // Enable the tool by removing from disabled list
      selectedConfigToolSource.disabledTools = currentDisabled.filter(
        (name: string) => name !== toolName
      )
    } else {
      // Disable the tool by adding to disabled list
      selectedConfigToolSource.disabledTools = [...currentDisabled, toolName]
    }
    toolConfigChanged = true
  }

  const saveToolConfig = async () => {
    if (!selectedConfigToolSource) return
    try {
      selectedConfigToolSource = await agentsStore.updateToolSource(
        selectedConfigToolSource
      )
      notifications.success("Tool configuration saved successfully.")
      toolConfigChanged = false
    } catch (err) {
      console.error(err)
      notifications.error("Error saving tool configuration")
    }
  }

  const getChatPreview = (chat: AgentChat): string => {
    const messageCount = chat.messages.length
    if (!messageCount) {
      return "No messages"
    }
    const msg = chat.messages[messageCount - 1]?.content?.slice(0, 50)
    return typeof msg === "string" ? msg : "No preview available"
  }

  const getContextMenuItems = (toolSource: AgentToolSourceWithTools) => {
    return [
      {
        icon: "Edit",
        name: "Edit",
        keyBind: null,
        visible: true,
        disabled: false,
        callback: () => editToolSource(toolSource),
      },
      {
        icon: "Delete",
        name: "Delete",
        keyBind: null,
        visible: true,
        disabled: false,
        callback: () => confirmDeleteToolSource(toolSource),
      },
    ]
  }

  const createToolMenuCallback =
    (toolSource: AgentToolSourceWithTools) => (e: MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      const items = getContextMenuItems(toolSource)
      contextMenuStore.open("agent-tool", items, { x: e.clientX, y: e.clientY })
    }

  onMount(async () => {
    await agentsStore.init()

    chat = { title: "", messages: [] }

    // Ensure we always autoscroll to reveal new messages
    observer = new MutationObserver(async () => {
      await tick()
      if (chatAreaElement) {
        chatAreaElement.scrollTop = chatAreaElement.scrollHeight
      }
    })

    if (chatAreaElement) {
      observer.observe(chatAreaElement, {
        childList: true,
        subtree: true,
        attributes: true,
      })
    }

    await tick()
    if (textareaElement) {
      textareaElement.focus()
    }
  })

  onDestroy(() => {
    observer.disconnect()
  })
</script>

<div class="wrapper">
  <TopBar breadcrumbs={[{ text: "Agent" }]} icon="cpu"></TopBar>
  <div class="page">
    <Panel customWidth={260} borderRight noHeaderBorder>
      <NavHeader
        slot="panel-title-content"
        title="Chats"
        onAdd={startNewChat}
        searchable={false}
      />

      {#each chatHistory as chatItem}
        <NavItem
          text={chatItem.title || "Untitled Chat"}
          subtext={getChatPreview(chatItem)}
          on:click={() => selectChat(chatItem)}
          selected={$agentsStore.currentChatId === chatItem._id}
          withActions={false}
        />
      {/each}
      {#if !chatHistory.length}
        <div class="empty-state">
          <Body size="S">
            No chat history yet.<br />
            Start a new conversation!
          </Body>
        </div>
      {/if}
    </Panel>

    <div class="chat-wrapper">
      <div class="chat-area" bind:this={chatAreaElement}>
        <Chatbox bind:chat {loading} />
        <div class="input-wrapper">
          <textarea
            bind:value={inputValue}
            bind:this={textareaElement}
            class="input spectrum-Textfield-input"
            on:keydown={handleKeyDown}
            placeholder="Ask anything"
            disabled={loading}
          />
        </div>
      </div>
    </div>

    <Panel customWidth={320} borderLeft noHeaderBorder={panelView === "tools"}>
      <NavHeader
        slot="panel-title-content"
        title="Tools"
        onAdd={toolSourceModal?.show}
        searchable={false}
        showAddIcon={panelView === "tools"}
      >
        {#if panelView === "tools"}
          <Body size="S">Tools</Body>
        {:else}
          <div class="tool-config-header">
            <Icon
              name="BackAndroid"
              size="XS"
              hoverable
              on:click={backToToolsList}
            />
            <svelte:component
              this={Logos[selectedConfigToolSource.type]}
              height="16"
              width="16"
            />
            <Body size="S">
              {ToolSources.find(ts => selectedConfigToolSource.type === ts.type)
                ?.name}
            </Body>
          </div>
        {/if}
        <div slot="right" style="display:contents;">
          {#if panelView === "toolConfig"}
            <Button
              cta
              size="S"
              on:click={saveToolConfig}
              disabled={!toolConfigChanged}>Save</Button
            >
          {/if}
        </div>
      </NavHeader>
      {#if panelView === "tools"}
        <Layout paddingX="L" paddingY="none" gap="S">
          <InfoDisplay
            body="Add tools to give your agent knowledge and allow it to take
                action"
          />
          {#if toolSources.length > 0}
            <div class="saved-tools-list">
              {#each toolSources as toolSource}
                {@const menuCallback = createToolMenuCallback(toolSource)}
                <NavItem
                  text={ToolSources.find(ts => ts.type === toolSource.type)
                    ?.name || ""}
                  on:click={() => openToolsConfig(toolSource)}
                  on:contextmenu={menuCallback}
                >
                  <div class="tool-icon" slot="icon">
                    <svelte:component
                      this={Logos[toolSource.type]}
                      height="16"
                      width="16"
                    />
                  </div>
                  <Icon
                    on:click={menuCallback}
                    hoverable
                    name="MoreSmallList"
                  />
                  <Icon size="S" name="ChevronRight" slot="right" />
                </NavItem>
              {/each}
            </div>
          {:else}
            <div class="empty-state">
              <Body size="S">
                No tools connected yet.
                <br />
                Click "Add Tools" to get started!
              </Body>
            </div>
          {/if}
        </Layout>
      {:else if panelView === "toolConfig"}
        <Layout paddingX="L" paddingY="L" gap="S">
          {#if selectedConfigToolSource?.tools}
            <div class="tools-list">
              {#each selectedConfigToolSource.tools as tool}
                <div class="tool-toggle-item">
                  <div class="tool-toggle-info">
                    <div class="tool-toggle-name">{tool.name}</div>
                    <div class="tool-toggle-description">
                      {tool.description}
                    </div>
                  </div>
                  <div class="tool-toggle-switch">
                    <Toggle
                      value={!selectedConfigToolSource.disabledTools?.includes(
                        tool.name
                      )}
                      on:change={() => toggleTool(tool.name)}
                    />
                  </div>
                </div>
              {/each}
            </div>
          {:else}
            <div class="empty-state">
              <Body size="S">No tools available for this source.</Body>
            </div>
          {/if}
        </Layout>
      {/if}
    </Panel>
  </div>
</div>

<Modal bind:this={toolSourceModal}>
  <ModalContent
    title="Tools"
    size="L"
    showCancelButton={false}
    showConfirmButton={false}
    showCloseIcon
    onCancel={() => toolSourceModal.hide()}
  >
    <section class="tool-source-tiles">
      {#each ToolSources as toolSource}
        <div class="tool-source-tile">
          <div class="tool-source-header">
            {#if Logos[toolSource.type]}
              <div class="tool-source-icon">
                <svelte:component
                  this={Logos[toolSource.type]}
                  height="20"
                  width="20"
                />
              </div>
            {/if}
            <Heading size="XS">{toolSource.name}</Heading>
          </div>
          <div class="tool-source-description">
            <Body size="S" color="var(--spectrum-global-color-gray-700)">
              {toolSource.description}
            </Body>
          </div>
          {#if toolSources.some(ts => ts.type === toolSource.type)}
            <div class="tile-connected">
              <Icon size="S" name="CheckmarkCircle" />
              Connected
            </div>
          {:else}
            <div>
              <Button cta size="S" on:click={() => openToolConfig(toolSource)}>
                Connect
              </Button>
            </div>
          {/if}
        </div>
      {/each}
    </section>
  </ModalContent>
</Modal>

<Modal bind:this={toolConfigModal}>
  <ModalContent
    title={`${selectedToolSource?.existingToolSource ? "Edit" : "Configure"} ${
      selectedToolSource?.name || "Tool"
    }`}
    size="M"
    showCancelButton={true}
    cancelText="Back"
    showConfirmButton={true}
    confirmText="Save"
    showCloseIcon
    onCancel={handleConfigBack}
    onConfirm={handleConfigSave}
  >
    <div class="config-form">
      {#if selectedToolSource}
        {#if selectedToolSource.type === "GITHUB"}
          <Input
            label="API Key"
            bind:value={toolConfig.apiKey}
            type="password"
            placeholder="Enter your GitHub API token"
          />
          <Input
            label="Base URL (Optional)"
            bind:value={toolConfig.baseUrl}
            type="text"
            placeholder="https://api.github.com (leave empty for default)"
          />
          <TextArea
            label="Tool Source Guidelines"
            bind:value={toolConfig.guidelines}
            placeholder="Add additional information to help guide the Budibase agent in the usage of this tool"
          />
        {:else if selectedToolSource.type === "CONFLUENCE"}
          <Input
            label="API Key"
            bind:value={toolConfig.apiKey}
            type="password"
            placeholder="Enter your Confluence API token"
          />
          <Input
            label="Email Address"
            bind:value={toolConfig.email}
            type="email"
            placeholder="your.email@domain.com"
            helpText="Your Atlassian account email address"
          />
          <Input
            label="Base URL (Optional)"
            bind:value={toolConfig.baseUrl}
            type="text"
            placeholder="https://your-domain.atlassian.net"
          />
          <TextArea
            label="Tool Source Guidelines"
            bind:value={toolConfig.guidelines}
            placeholder="Add additional information to help guide the Budibase agent in the usage of this tool"
          />
        {:else if selectedToolSource.type === "BAMBOOHR"}
          <Input
            label="API Key"
            bind:value={toolConfig.apiKey}
            type="password"
            placeholder="Enter your BambooHR API key"
          />
          <Input
            label="Subdomain"
            bind:value={toolConfig.subdomain}
            type="text"
            placeholder="your-company"
            helpText="Your BambooHR subdomain (e.g., 'mycompany' for mycompany.bamboohr.com)"
          />
          <TextArea
            label="Tool Source Guidelines"
            bind:value={toolConfig.guidelines}
            placeholder="Add additional information to help guide the Budibase agent in the usage of this tool"
          />
        {:else if selectedToolSource.type === "BUDIBASE"}
          <TextArea
            label="Tool Source Guidelines"
            bind:value={toolConfig.guidelines}
            placeholder="Add additional information to help guide the Budibase agent in the usage of this tool"
          />
        {/if}
      {/if}
    </div>
  </ModalContent>
</Modal>

<Modal bind:this={deleteConfirmModal}>
  <ModalContent
    title="Delete Tool Source"
    size="S"
    showCancelButton={true}
    cancelText="Cancel"
    showConfirmButton={true}
    confirmText="Delete"
    showCloseIcon
    onCancel={() => deleteConfirmModal.hide()}
    onConfirm={deleteToolSource}
  >
    <div class="delete-confirm-content">
      <Body size="S">
        Are you sure you want to delete this tool source? This action cannot be
        undone.
      </Body>
      {#if toolSourceToDelete}
        <div class="tool-source-preview">
          <div class="tool-icon">
            <svelte:component
              this={Logos[toolSourceToDelete.type]}
              height="20"
              width="20"
            />
          </div>
          <span class="tool-name">
            {ToolSources.find(ts => ts.type === toolSourceToDelete.type)?.name}
          </span>
        </div>
      {/if}
    </div>
  </ModalContent>
</Modal>

<style>
  .wrapper {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    flex: 1 1 auto;
  }

  .page {
    flex: 1 1 auto;
    display: flex;
    position: relative;
    overflow-y: hidden;
    overflow-x: hidden;
    flex-direction: row;
    height: 0;
    width: 100%;
    align-items: stretch;
  }

  .chat-wrapper {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
  }
  .chat-area {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    height: 0;
  }

  .tool-source-tiles {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .tool-source-tile {
    padding: var(--spacing-xl);
    border: 1px solid var(--spectrum-global-color-gray-300);
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    gap: var(--spacing-m);
    height: 110px;
    border-radius: 4px;
  }

  .tool-source-header {
    display: flex;
    align-items: center;
    gap: var(--spacing-m);
  }
  .tool-source-description {
    flex: 1 1 auto;
  }
  .tool-source-description :global(p) {
    overflow: hidden;
    line-clamp: 2;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    display: -webkit-box;
  }
  .tile-connected {
    color: var(--spectrum-global-color-green-400);
    display: flex;
    gap: 6px;
    font-size: 12px;
  }
  .tool-source-icon {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .input-wrapper {
    position: sticky;
    bottom: 0;
    width: 600px;
    margin: 0 auto;
    background: var(--background-alt);
    padding-bottom: 32px;
    display: flex;
    flex-direction: column;
  }

  textarea {
    width: 100%;
    height: 100px;
    top: 0;
    resize: none;
    padding: 20px;
    font-size: 16px;
    background-color: var(--grey-3);
    color: var(--grey-9);
    border-radius: 16px;
    border: none;
    outline: none;
    min-height: 100px;
    margin-bottom: 8px;
  }

  textarea::placeholder {
    color: var(--spectrum-global-color-gray-600);
  }

  .config-form {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-l);
  }

  .empty-state {
    text-align: center;
    padding: var(--spacing-xl);
  }
  .empty-state :global(p) {
    color: var(--spectrum-global-color-gray-700);
  }

  .saved-tools-list {
    margin: 0 calc(-1 * var(--spacing-l));
    display: flex;
    flex-direction: column;
  }
  .tool-icon {
    display: grid;
    place-items: center;
    margin-right: 4px;
  }

  .tool-name {
    font-weight: 600;
    color: var(--spectrum-global-color-gray-900);
    margin-bottom: var(--spacing-xs);
  }

  .tool-config-header {
    display: flex;
    flex-direction: row;
    gap: var(--spacing-m);
    align-items: center;
  }

  .tools-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-m);
    margin-bottom: var(--spacing-xl);
    overflow: hidden;
  }

  .tool-toggle-item {
    display: flex;
    align-items: center;
    padding: var(--spacing-m);
    border: 1px solid var(--spectrum-global-color-gray-300);
    border-radius: 8px;
    background-color: var(--background-alt);
    gap: var(--spacing-m);
  }
  .tool-toggle-info {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    gap: 2px;
    overflow: hidden;
  }
  .tool-toggle-name {
    color: var(--spectrum-global-color-gray-900);
    margin-bottom: var(--spacing-xs);
    font-family: var(--font-mono), monospace;
    font-size: 11px;
    word-break: break-all;
  }
  .tool-toggle-description {
    font-size: 12px;
    color: var(--spectrum-global-color-gray-700);
  }
  .tool-toggle-switch {
    margin-right: -14px;
  }

  .delete-confirm-content {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-l);
  }

  .tool-source-preview {
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
    padding: var(--spacing-m);
    border: 1px solid var(--spectrum-global-color-gray-300);
    border-radius: 8px;
    background-color: var(--background-alt);
  }

  .tool-source-preview .tool-name {
    font-weight: 600;
    color: var(--spectrum-global-color-gray-900);
    margin: 0;
  }
</style>
