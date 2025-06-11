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
    Tab,
    Tabs,
    TextArea,
    Toggle,
  } from "@budibase/bbui"
  import { agentsStore } from "@/stores/portal"
  import Chatbox from "./Chatbox.svelte"
  import type {
    AgentChat,
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

  $: chatHistory = $agentsStore.chats || []
  $: toolSources = $agentsStore.toolSources || []

  import { tick } from "svelte"
  import NavHeader from "@/components/common/NavHeader.svelte"
  import InfoDisplay from "@/pages/builder/app/[application]/design/[screenId]/[componentId]/_components/Component/InfoDisplay.svelte"
  import NavItem from "@/components/common/NavItem.svelte"

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

    try {
      // Send copy with new message to API
      const response = await API.agentChat(updatedChat)

      // Update chat with response from API
      chat = response

      // Update the current chat ID in the store
      if (response._id) {
        agentsStore.setCurrentChatId(response._id)
        // Refresh chat history to include the new/updated chat
        await agentsStore.fetchChats()
      }

      // Scroll to the response
      await scrollToBottom()
    } catch (err: any) {
      console.error(err)
      notifications.error(err.message)
    }

    loading = false

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
    } catch (err) {
      console.error(err)
      notifications.error(
        selectedToolSource.existingToolSource
          ? "Error updating tool source"
          : "Error saving tool source"
      )
    }
  }

  const openToolsConfig = (toolSource: any) => {
    selectedConfigToolSource = toolSource
    panelView = "toolConfig"
  }

  const backToToolsList = () => {
    panelView = "tools"
    selectedConfigToolSource = null
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
  }

  const saveToolConfig = async () => {
    if (!selectedConfigToolSource) return

    try {
      await agentsStore.updateToolSource(selectedConfigToolSource)
      notifications.success("Tool configuration saved successfully.")
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

<div class="page">
  <Panel customWidth={260} borderRight noHeaderBorder>
    <NavHeader
      slot="panel-title-content"
      title="Chats"
      placeholder="Search for automations"
      onAdd={startNewChat}
      searchable={false}
    />

    {#each chatHistory as chatItem}
      <NavItem
        icon="Chat"
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

  <Panel customWidth={320} borderLeft>
    <Tabs selected="Tools">
      <Tab title="Tools">
        <div class="tab-content">
          {#if panelView === "tools"}
            <InfoDisplay
              body="Add tools to give your agent knowledge and allow it to take
                action"
            />
            <div class="agent-actions-heading">
              <Heading size="XS">Tools and Knowledge</Heading>
              <Button size="S" cta on:click={() => toolSourceModal.show()}>
                Add Tools
              </Button>
            </div>

            {#if toolSources.length > 0}
              <div class="saved-tools-list">
                {#each toolSources as toolSource}
                  <div class="saved-tool-item">
                    <div class="tool-icon">
                      <svelte:component
                        this={Logos[toolSource.type]}
                        height="26"
                        width="26"
                      />
                    </div>
                    <div class="tool-info">
                      <div class="tool-name">
                        {ToolSources.find(ts => ts.type === toolSource.type)
                          ?.name}
                      </div>
                    </div>
                    <div class="tool-actions">
                      <Icon
                        size="S"
                        hoverable
                        name="Edit"
                        on:click={() => editToolSource(toolSource)}
                      />
                      <Icon
                        size="S"
                        hoverable
                        name="Delete"
                        on:click={() => confirmDeleteToolSource(toolSource)}
                      />
                      <div class="tool-source-detail">
                        <Icon
                          size="S"
                          hoverable
                          name="BackAndroid"
                          on:click={() => openToolsConfig(toolSource)}
                        />
                      </div>
                    </div>
                  </div>
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
          {:else if panelView === "toolConfig"}
            <div class="tool-config-header">
              <Icon name="BackAndroid" hoverable on:click={backToToolsList} />
              <Heading size="S"
                >{ToolSources.find(
                  ts => selectedConfigToolSource.type === ts.type
                )?.name}</Heading
              >
              <Button size="S" cta on:click={saveToolConfig}>
                Save Configuration
              </Button>
            </div>

            {#if selectedConfigToolSource?.tools}
              <div class="tools-list">
                {#each selectedConfigToolSource.tools as tool}
                  <div class="tool-toggle-item">
                    <div class="tool-toggle-icon">
                      {#if Logos[selectedConfigToolSource.type]}
                        <svelte:component
                          this={Logos[selectedConfigToolSource.type]}
                          height="20"
                          width="20"
                        />
                      {/if}
                    </div>
                    <div class="tool-toggle-info">
                      <div class="tool-toggle-name">{tool.name}</div>
                      <div class="tool-toggle-description">
                        {tool.description}
                      </div>
                    </div>
                    <Toggle
                      value={!selectedConfigToolSource.disabledTools?.includes(
                        tool.name
                      )}
                      on:change={() => toggleTool(tool.name)}
                    />
                  </div>
                {/each}
              </div>
            {:else}
              <div class="no-tools-message">
                <Body size="S">No tools available for this source.</Body>
              </div>
            {/if}
          {/if}
        </div>
      </Tab>
      <Tab title="Deploy">
        <div class="tab-content">Deploy</div>
      </Tab>
    </Tabs>
  </Panel>
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
    <div class="vote-banner">
      <Icon name="Hand" />
      <span> Vote for which tools we add next </span>
      <Button>Vote</Button>
    </div>
    <section class="tool-source-tiles">
      {#each ToolSources as toolSource}
        <div class="tool-source-tile">
          <div class="tool-source-header">
            <div class="tool-source-icon">
              {#if Logos[toolSource.type]}
                <svelte:component
                  this={Logos[toolSource.type]}
                  height="24"
                  width="24"
                />
              {/if}
            </div>
            <Heading size="XS">{toolSource.name}</Heading>
          </div>
          <Body size="S">
            {toolSource.description}
          </Body>
          <Button
            cta
            size="S"
            disabled={toolSources.some(ts => ts.type === toolSource.type)}
            on:click={() => openToolConfig(toolSource)}
          >
            Connect
          </Button>
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
  .page {
    flex: 1 1 auto;
    display: flex;
    position: relative;
    overflow-y: hidden;
    overflow-x: hidden;
    flex-direction: row;
    height: 100%;
    width: 100%;
    align-items: stretch;
  }

  .chat-area {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
  }

  .agent-actions-heading {
    margin-top: var(--spacing-xl);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .tab-content {
    padding: var(--spacing-s) var(--spacing-xl);
  }

  .tool-source-tiles {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  .tool-source-tile {
    padding: var(--spacing-xl);
    border: 1px solid var(--spectrum-global-color-gray-300);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100px;
    border-radius: 5px;
  }

  .tool-source-header {
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
    margin-bottom: var(--spacing-s);
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
    padding-bottom: 48px;
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

  .history-list {
    flex: 1;
    overflow-y: auto;
  }

  .history-item {
    padding: var(--spacing-m);
    border: 1px solid var(--spectrum-alias-border-color);
    border-radius: 8px;
    margin-bottom: var(--spacing-s);
    cursor: pointer;
    transition: all 0.2s ease;
    width: 100%;
    background-color: var(--spectrum-alias-background-color-default);
  }

  .history-item:hover {
    background-color: var(--spectrum-alias-background-color-hover);
    border-color: var(--spectrum-alias-border-color-hover);
  }

  .history-item.active {
    background-color: var(--spectrum-alias-background-color-selected);
    border-color: var(--spectrum-alias-border-color-selected);
  }

  .chat-title {
    font-weight: 600;
    color: var(--spectrum-alias-text-color);
    margin-bottom: var(--spacing-xs);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .chat-preview {
    font-size: 12px;
    color: var(--spectrum-global-color-gray-600);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .empty-state {
    text-align: center;
    padding: var(--spacing-xl);
  }
  .empty-state :global(p) {
    color: var(--spectrum-global-color-gray-700);
  }

  .saved-tools-list {
    margin-top: var(--spacing-m);
  }

  .saved-tool-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--spacing-m);
    gap: var(--spacing-m);
    border: 1px solid var(--spectrum-global-color-gray-300);
    border-radius: 8px;
    margin-bottom: var(--spacing-s);
    background-color: var(--background);
  }

  .tool-info {
    flex: 1;
  }

  .tool-name {
    font-weight: 600;
    color: var(--spectrum-global-color-gray-900);
    margin-bottom: var(--spacing-xs);
  }

  .tool-actions {
    display: flex;
    gap: var(--spacing-s);
  }

  .tool-source-detail {
    transform: rotate(180deg);
  }

  .no-tools-message {
    text-align: center;
    padding: var(--spacing-xl);
    color: var(--spectrum-global-color-gray-600);
    margin-top: var(--spacing-xl);
  }

  .tool-config-header {
    display: flex;
    flex-direction: row;
    gap: var(--spacing-m);
    margin-bottom: var(--spacing-xl);
    align-items: center;
  }

  .tools-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-m);
    margin-bottom: var(--spacing-xl);
  }

  .tool-toggle-item {
    display: flex;
    align-items: center;
    padding: var(--spacing-m);
    border: 1px solid var(--spectrum-global-color-gray-300);
    border-radius: 8px;
    background-color: var(--background);
    gap: var(--spacing-m);
  }

  .tool-toggle-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .tool-toggle-info {
    flex: 1;
  }

  .tool-toggle-name {
    font-weight: 600;
    color: var(--spectrum-global-color-gray-900);
    margin-bottom: var(--spacing-xs);
  }

  .tool-toggle-description {
    font-size: 12px;
    color: var(--spectrum-global-color-gray-600);
  }

  .vote-banner {
    display: flex;
    align-items: center;
    gap: var(--spacing-l);
    background-color: #2e3851;
    border-radius: var(--border-radius-m);
    padding: var(--spacing-s);
  }

  .vote-banner:last-child {
    margin-left: auto;
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
    background-color: var(--spectrum-alias-background-color-secondary);
  }

  .tool-source-preview .tool-name {
    font-weight: 600;
    color: var(--spectrum-global-color-gray-900);
  }
</style>
