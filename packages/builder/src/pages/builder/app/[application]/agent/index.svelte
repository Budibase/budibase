<script lang="ts">
  import {
    ActionButton,
    Banner,
    Body,
    Button,
    Heading, Icon,
    Input,
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
  import type { AgentChat, CreateToolSourceRequest } from "@budibase/types"
  import { onDestroy, onMount } from "svelte"
  import Panel from "@/components/design/Panel.svelte"
  import { API } from "@/api"

  const ToolSources = [
    {
      name: "Budibase",
      description: "Connect agent to your Budibase tools"
    },
    {
      name: "Github",
      description: "Automate development workflows."
    },
    {
      name: "Confluence",
      description: "Connect agent to your teams documentation"
    },
    {
      name: "Sharepoint",
      description: "Sharepoint stuff"
    },
    {
      name: "JIRA Service Manaagement",
      description: "Automate ITSM Workflows"
    },
    {
      name: "Bamboo",
      description: "Automate HR workflows"
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
  let selectedToolSource: any = null
  let selectedConfigToolSource: any = null
  let panelView: "tools" | "toolConfig" = "tools"
  let toolConfig = {
    apiKey: "",
    guidelines: "",
    type: "GITHUB" as const
  }

  $: chatHistory = $agentsStore.chats || []
  $: toolSources = $agentsStore.toolSources || []

  import { tick } from "svelte"

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

    const userMessage = { role: "user", content: inputValue }

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

  const reset = async () => {
    chat = { title: "", messages: [] }
    agentsStore.clearCurrentChatId()
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
    toolConfig = {
      apiKey: "",
      guidelines: "",
      // TODO: make this less shit
      type: toolSource.name === "Github" ? "GITHUB" :
            toolSource.name === "Confluence" ? "ATLASSIAN" :
            "BUDIBASE"
    }
    toolSourceModal.hide()
    toolConfigModal.show()
  }

  const handleConfigBack = () => {
    toolConfigModal.hide()
    toolSourceModal.show()
  }

  const handleConfigSave = async () => {
    try {
      const toolSourceData: CreateToolSourceRequest = {
        type: toolConfig.type,
        disabledTools: [],
        auth: {
          apiKey: toolConfig.apiKey,
          guidelines: toolConfig.guidelines
        }
      }
      
      await agentsStore.createToolSource(toolSourceData)
      notifications.success("Tool Source saved successfully.")
      toolConfigModal.hide()
    } catch (err) {
      console.error(err)
      notifications.error("Error saving Tool Source")
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
      selectedConfigToolSource.disabledTools = currentDisabled.filter(name => name !== toolName)
    } else {
      // Disable the tool by adding to disabled list
      selectedConfigToolSource.disabledTools = [...currentDisabled, toolName]
    }
  }

  const saveToolConfig = () => {
    // Placeholder for now - just show success message
    notifications.success("Tool configuration saved successfully.")
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
  <div class="layout">
    <div class="history-panel">
      <Panel customWidth={300}>
        <div class="chat-history">
          <div class="history-header">
            <Heading size="XS">Chat History</Heading>
            <Button size="S" cta on:click={startNewChat}>
              New Chat
            </Button>
          </div>
          <div class="history-list">
            {#each chatHistory as chatItem}
              <button
                class="history-item" 
                class:active={$agentsStore.currentChatId === chatItem._id}
                on:click={() => selectChat(chatItem)}
              >
                <div class="chat-title">
                  {chatItem.title || "Untitled Chat"}
                </div>
                <div class="chat-preview">
                  {chatItem.messages.length > 0 ? chatItem.messages[chatItem.messages.length - 1]?.content?.slice(0, 50) + "..." : "No messages"}
                </div>
              </button>
            {/each}
            {#if chatHistory.length === 0}
              <div class="empty-state">
                <Body size="S">No chat history yet. Start a new conversation!</Body>
              </div>
            {/if}
          </div>
        </div>
      </Panel>
    </div>

    <div class="chat-area" bind:this={chatAreaElement}>
      <Chatbox bind:chat {loading} />
      <div class="controls">
        <ActionButton quiet on:click={reset}>Reset history</ActionButton>
      </div>
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

    <div class="panel-container">
      <Panel
        customWidth={400}
      >
        <div class="agent-panel">
          <Tabs selected="Tools">
            <Tab title="Tools">
              <div class="tab-content">
                {#if panelView === "tools"}
                  <div class="agent-info">
                    Add tools to give your agent knowledge and allow it to take action.
                  </div>
                  <div class="agent-actions-heading">
                    <Heading size="XS">
                      Tools and Knowledge
                    </Heading>
                    <Button size="S" cta on:click={() => toolSourceModal.show()}>
                      Add Tools
                    </Button>
                  </div>
                  
                  {#if toolSources.length > 0}
                    <div class="saved-tools-list">
                      {#each toolSources as toolSource}
                        <div class="saved-tool-item">
                          <div class="tool-info">
                            <div class="tool-name">{toolSource.type}</div>
                          </div>
                          <div class="tool-actions">
                            <Icon size="S" hoverable name="BackAndroid" on:click={() => openToolsConfig(toolSource)}/>
                          </div>
                        </div>
                      {/each}
                    </div>
                  {:else}
                    <div class="no-tools-message">
                      <Body size="S">No tools connected yet. Click "Add Tools" to get started!</Body>
                    </div>
                  {/if}
                {:else if panelView === "toolConfig"}
                  <div class="tool-config-header">
                    <Button size="S" quiet on:click={backToToolsList}>
                      <Icon name="BackAndroid" />
                      Back
                    </Button>
                    <Heading size="XS">
                      Configure {selectedConfigToolSource?.type} Tools
                    </Heading>
                  </div>
                  
                  {#if selectedConfigToolSource?.tools}
                    <div class="tools-list">
                      {#each selectedConfigToolSource.tools as tool}
                        <div class="tool-toggle-item">
                          <div class="tool-toggle-info">
                            <div class="tool-toggle-name">{tool.name}</div>
                            <div class="tool-toggle-description">{tool.description}</div>
                          </div>
                          <Toggle 
                            value={!selectedConfigToolSource.disabledTools?.includes(tool.name)}
                            on:change={() => toggleTool(tool.name)}
                          />
                        </div>
                      {/each}
                    </div>
                    
                    <div class="tool-config-actions">
                      <Button size="S" cta on:click={saveToolConfig}>
                        Save Configuration
                      </Button>
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
              <div class="tab-content">
                Deploy
              </div>
            </Tab>
          </Tabs>
        </div>
      </Panel>
    </div>
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
    <Banner
      extraButtonAction={() => {}}
      extraButtonText="Vote"
      showCloseButton={false}
      icon="Hand"
    >
      Vote for which tools we add next
    </Banner>
    <section class="tool-source-tiles">
      {#each ToolSources as toolSource}
        <div class="tool-source-tile">
          <Heading size="XS">{toolSource.name}</Heading>
          <Body size="S">
            {toolSource.description}
          </Body>
          <Button cta size="S" on:click={() => openToolConfig(toolSource)}>
            Connect
          </Button>
        </div>
      {/each}
    </section>
  </ModalContent>
</Modal>

<Modal bind:this={toolConfigModal}>
  <ModalContent
    title={`Configure ${selectedToolSource?.name || 'Tool'}`}
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
      <Input
        label="API Key"
        bind:value={toolConfig.apiKey}
        type="password"
        placeholder="Enter your API key"
      />
      <TextArea
        label="Tool Source Guidelines"
        bind:value={toolConfig.guidelines}
        placeholder="Add additional information to help guide the Budibase agent in the usage of this tool"
        rows={6}
      />
    </div>
  </ModalContent>
</Modal>

<style>
  .page {
    height: 0;
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    position: relative;
    overflow-y: scroll;
    overflow-x: hidden;
  }

  .layout {
    display: flex;
    flex-direction: row;
    height: 100%;
    width: 100%;
  }

  .history-panel {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 300px;
    display: flex;
  }

  .chat-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    margin-left: 300px;
    max-width: calc(100% - 700px);
  }

  .panel-container {
    position: fixed;
    top: 0;
    right: 0;
    height: 100%;
    width: 400px;
    display: flex;
  }

  .agent-panel {
    padding: var(--spacing-xl);
  }

  .agent-info {
    padding: var(--spacing-m);
    border: 1px solid black;
    border-radius: 5px;
  }

  .agent-actions-heading {
    margin-top: var(--spacing-xl);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .tab-content {
    padding: var(--spacing-xl);
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

  .controls {
    position: fixed;
    bottom: 8px;
    right: calc(50% - 300px);
    z-index: 1;
  }

  .config-form {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-l);
  }

  .chat-history {
    padding: var(--spacing-xl);
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .history-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-l);
  }

  .history-list {
    flex: 1;
    overflow-y: auto;
  }

  .history-item {
    padding: var(--spacing-m);
    border: 1px solid var(--spectrum-global-color-gray-300);
    border-radius: 8px;
    margin-bottom: var(--spacing-s);
    cursor: pointer;
    transition: all 0.2s ease;
    width: 100%;
  }

  .history-item:hover {
    background-color: var(--spectrum-global-color-gray-100);
    border-color: var(--spectrum-global-color-blue-400);
  }

  .history-item.active {
    background-color: var(--spectrum-global-color-blue-100);
    border-color: var(--spectrum-global-color-blue-500);
  }

  .chat-title {
    font-weight: 600;
    color: var(--spectrum-global-color-gray-900);
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
    color: var(--spectrum-global-color-gray-600);
  }

  .saved-tools-section {
    margin-top: var(--spacing-xl);
  }

  .saved-tools-list {
    margin-top: var(--spacing-m);
  }

  .saved-tool-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--spacing-m);
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

  .tool-details {
    font-size: 12px;
    color: var(--spectrum-global-color-gray-600);
  }

  .tool-actions {
    display: flex;
    gap: var(--spacing-s);
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
    flex-direction: column;
    gap: var(--spacing-m);
    margin-bottom: var(--spacing-xl);
  }

  .tools-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-m);
    margin-bottom: var(--spacing-xl);
  }

  .tool-toggle-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--spacing-m);
    border: 1px solid var(--spectrum-global-color-gray-300);
    border-radius: 8px;
    background-color: var(--background);
  }

  .tool-toggle-info {
    flex: 1;
    margin-right: var(--spacing-m);
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

  .tool-config-actions {
    display: flex;
    justify-content: flex-end;
    margin-top: var(--spacing-xl);
  }
</style>
