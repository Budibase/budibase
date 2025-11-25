<script lang="ts">
  import {
    Body,
    Button,
    Heading,
    Input,
    Layout,
    notifications,
    Select,
    TextArea,
    ActionButton,
    Modal,
    ModalContent,
    Tags,
    Tag,
    Icon,
    Helpers,
  } from "@budibase/bbui"
  import type { Agent } from "@budibase/types"
  import TopBar from "@/components/common/TopBar.svelte"
  import { agentsStore, aiConfigsStore } from "@/stores/portal"
  import EditableIcon from "@/components/common/EditableIcon.svelte"
  import { onMount, type ComponentType } from "svelte"
  import { bb } from "@/stores/bb"
  import AgentToolConfigModal from "./AgentToolConfigModal.svelte"
  import BambooHRLogo from "../logos/BambooHR.svelte"
  import BudibaseLogo from "../logos/Budibase.svelte"
  import ConfluenceLogo from "../logos/Confluence.svelte"
  import GithubLogo from "../logos/Github.svelte"

  const Logos: Record<string, ComponentType> = {
    BUDIBASE: BudibaseLogo,
    CONFLUENCE: ConfluenceLogo,
    GITHUB: GithubLogo,
    BAMBOOHR: BambooHRLogo,
  }

  let currentAgent: Agent | undefined
  let draftAgentId: string | undefined
  let draft = {
    name: "",
    description: "",
    aiconfig: "",
    goal: "",
    promptInstructions: "",
    icon: "",
    iconColor: "",
  }
  let toolConfigModal: AgentToolConfigModal
  let deleteConfirmModal: Modal
  let toolSourceToDelete: any = null

  $: currentAgent = $agentsStore.agents.find(
    a => a._id === $agentsStore.currentAgentId
  )

  $: if (currentAgent && currentAgent._id !== draftAgentId) {
    draft = {
      name: currentAgent.name || "",
      description: currentAgent.description || "",
      aiconfig: currentAgent.aiconfig || "",
      goal: currentAgent.goal || "",
      promptInstructions: currentAgent.promptInstructions || "",
      icon: currentAgent.icon || "",
      iconColor: currentAgent.iconColor || "",
    }
    draftAgentId = currentAgent._id
  }

  $: aiConfigs = $aiConfigsStore.customConfigs
  $: modelOptions = aiConfigs.map(config => ({
    label: config.name || config._id || "Unnamed",
    value: config._id || "",
  }))

  $: toolSources = $agentsStore.toolSources || []

  async function saveAgent() {
    if (!currentAgent) return
    try {
      await agentsStore.updateAgent({
        ...currentAgent,
        ...draft,
      })

      notifications.success("Agent saved successfully")
      await agentsStore.fetchAgents()
    } catch (error) {
      console.error(error)
      notifications.error("Error saving agent")
    }
  }

  async function toggleAgentLive() {
    if (!currentAgent) return

    try {
      if (currentAgent.live) {
        await agentsStore.updateAgent({
          ...currentAgent,
          ...draft,
          live: false,
        })
        notifications.success("Agent has been paused")
      } else {
        await agentsStore.updateAgent({
          ...currentAgent,
          ...draft,
          live: true,
        })
        notifications.success("Agent is now live")
      }
      await agentsStore.fetchAgents()
    } catch (error) {
      console.error(error)
      notifications.error(
        currentAgent.live ? "Error pausing agent" : "Error setting agent live"
      )
    }
  }

  const confirmDeleteToolSource = (e: PointerEvent, toolSource: any) => {
    e.stopPropagation()
    toolSourceToDelete = toolSource
    deleteConfirmModal.show()
  }

  const deleteToolSource = async () => {
    if (!toolSourceToDelete) return
    try {
      await agentsStore.deleteToolSource(toolSourceToDelete.id)
      notifications.success("Tool source deleted successfully.")
      deleteConfirmModal.hide()
      toolSourceToDelete = null
    } catch (err) {
      console.error(err)
      notifications.error("Error deleting tool source")
    }
  }

  const agentUrl = "budibase.app/chat/3432343dff34334334dfd"

  async function copyAgentUrl() {
    try {
      await Helpers.copyToClipboard(agentUrl)
      notifications.success("URL copied to clipboard")
    } catch (error) {
      console.error(error)
      notifications.error("Failed to copy URL")
    }
  }

  function openAgentUrl() {
    window.open(`https://${agentUrl}`, "_blank")
  }

  onMount(async () => {
    await Promise.all([
      agentsStore.init(),
      aiConfigsStore.fetch(),
      $agentsStore.currentAgentId
        ? agentsStore.fetchToolSources($agentsStore.currentAgentId)
        : Promise.resolve(),
    ])
  })
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->

<div class="config-wrapper">
  <TopBar
    breadcrumbs={[
      { text: "Agents", url: "../" },
      { text: currentAgent?.name || "Agent" },
    ]}
    icon="Effect"
  >
    <Button cta icon="save" on:click={saveAgent}>Save Changes</Button>
  </TopBar>
  <div class="config-page">
    <div class="config-content">
      <div class="config-form">
        <Layout paddingY="XL" gap="L">
          <div class="name-row">
            <div class="name-input">
              <Input
                label="Name"
                labelPosition="left"
                bind:value={draft.name}
                placeholder="Give your agent a name"
              />
            </div>
            <EditableIcon
              name={draft.icon}
              color={draft.iconColor}
              size="L"
              on:change={e => {
                draft.icon = e.detail.name
                draft.iconColor = e.detail.color
              }}
            />
          </div>

          <Input
            label="Description"
            labelPosition="left"
            bind:value={draft.description}
            placeholder="Give your agent a description"
          />

          <div class="model-row">
            <div class="model-select">
              <Select
                label="Model"
                labelPosition="left"
                bind:value={draft.aiconfig}
                options={modelOptions}
                placeholder="Select a model"
              />
            </div>
            <ActionButton
              size="M"
              icon="sliders-horizontal"
              tooltip="Manage AI configurations"
              on:click={() => bb.settings("/ai")}
            />
          </div>

          <!-- <div class="section section-banner">
            <div class="section-header">
              <Heading size="XS">Variables / Bindings</Heading>
              <Body size="S" color="var(--spectrum-global-color-gray-700)">
                Add variables to your agent. For example, employee_name,
                product, ticket_status.
              </Body>
              <div class="add-button">
                <ActionButton size="S" icon="plus">Add</ActionButton>
              </div>
            </div>
          </div> -->

          <div class="section section-banner">
            <div class="section-header">
              <Heading size="XS">Tools</Heading>
              <Body size="S" color="var(--spectrum-global-color-gray-700)">
                Give your agent access to internal and external tools so it can
                complete tasks.
              </Body>
              {#if toolSources.length > 0}
                <div class="tools-tags">
                  <Tags>
                    {#each toolSources as toolSource}
                      <div on:click={() => toolConfigModal.show(toolSource)}>
                        <Tag
                          closable
                          on:click={e => confirmDeleteToolSource(e, toolSource)}
                        >
                          <div class="tag-content">
                            {#if Logos[toolSource.type]}
                              <svelte:component
                                this={Logos[toolSource.type]}
                                height="14"
                                width="14"
                              />
                            {/if}
                            {toolSource.type.toLocaleLowerCase()}
                          </div>
                        </Tag>
                      </div>
                    {/each}
                  </Tags>
                </div>
              {/if}
              <div class="add-button">
                <ActionButton
                  on:click={() => toolConfigModal.show()}
                  size="S"
                  icon="plus">Add</ActionButton
                >
              </div>
            </div>
          </div>

          <!-- <div class="section section-banner">
            <div class="section-header">
              <Heading size="XS">Guardrails</Heading>
              <Body size="S" color="var(--spectrum-global-color-gray-700)">
                Train your agent to deliver accurate, consistent answers across
                every workflow.
              </Body>
              <div class="add-button">
                <ActionButton size="S" icon="plus">Add</ActionButton>
              </div>
            </div>
          </div>
 -->
          <div class="section">
            <Input
              label="Goal"
              labelPosition="left"
              bind:value={draft.goal}
              placeholder="Raise a security alert."
            />
          </div>

          <div class="section">
            <TextArea
              label="Agent instructions"
              labelPosition="left"
              bind:value={draft.promptInstructions}
              placeholder="You are the Security Agent. When a user reports a possible incident, guide them to provide type, severity, and description. After collecting inputs, call the automation raise_security_alert. Respond concisely and confirm submission."
              minHeight={140}
            />
          </div>
        </Layout>
      </div>

      {#if currentAgent?.live}
        <div class="agent-live-card">
          <div class="live-header">
            <div class="live-icon">
              <Icon name="activity" size="M" />
            </div>
            <Heading size="S">Your agent is live.</Heading>
          </div>
          <div class="url-section">
            <div class="url">
              <Input readonly disabled value={agentUrl} />
            </div>
            <div class="url-actions">
              <div class="url-action-button">
                <Icon name="copy" size="S" on:click={copyAgentUrl} />
              </div>
              <div class="url-action-button">
                <Icon
                  name="arrow-square-out"
                  size="S"
                  on:click={openAgentUrl}
                />
              </div>
            </div>
          </div>
          <div class="live-actions">
            <Button secondary icon="pause" on:click={toggleAgentLive}
              >Pause agent</Button
            >
          </div>
        </div>
      {:else}
        <div class="agent-live-card">
          <Button
            quiet
            icon="play"
            iconColor="var(--bb-blue)"
            on:click={toggleAgentLive}>Set your agent live</Button
          >
          <div class="live-description">
            <Body size="S">
              Once your agent is live, it will be available to use.
            </Body>
            <Body size="S">You can pause your agent at any time.</Body>
          </div>
        </div>
      {/if}
    </div>
  </div>
</div>

<AgentToolConfigModal
  bind:this={toolConfigModal}
  agentId={$agentsStore.currentAgentId || ""}
/>

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
    </div>
  </ModalContent>
</Modal>

<style>
  .config-wrapper {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    flex: 1 1 auto;
    background: var(--background);
  }

  .config-page {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    height: 0;
    overflow-y: auto;
    overflow-x: hidden;
    padding: var(--spacing-xl) var(--spacing-l) var(--spacing-xl);
    box-sizing: border-box;
  }

  .config-content {
    max-width: 840px;
    width: 100%;
    margin: 0 auto;
    padding: var(--spacing-xl);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xl);
    border-radius: 16px;
    border: 1px solid var(--spectrum-global-color-gray-300);
    background: var(--spectrum-alias-background-color-primary);
  }

  .config-form {
    flex: 1 1 auto;
  }

  .model-row {
    display: flex;
    align-items: center;
    gap: var(--spacing-m);
  }

  .model-select {
    flex: 1;
  }

  .name-row {
    display: flex;
    align-items: center;
    gap: var(--spacing-xl);
  }

  .name-input {
    flex: 1;
  }

  /* Override input backgrounds to match design */
  :global(.config-form .spectrum-Textfield-input),
  :global(.config-form .spectrum-Picker) {
    background-color: var(--background) !important;
  }

  /* Align left-position labels into a clean column */
  :global(.config-form .spectrum-Form-item:not(.above)) {
    display: grid;
    grid-template-columns: 120px 1fr;
    align-items: center;
    column-gap: var(--spacing-m);
  }

  :global(.config-form .spectrum-Form-itemLabel) {
    justify-self: flex-start;
  }

  .section {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-m);
  }

  .section.section-banner {
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    padding: 0;
    border-radius: 0;
    background-color: transparent;
    border: none;
    gap: var(--spacing-m);
  }

  .section-header {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
    max-width: 100%;
  }

  .add-button {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-top: var(--spacing-s);
  }

  .agent-live-card {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-m);
    margin-top: var(--spacing-xl);
    padding: var(--spacing-xl);
    border-radius: 12px;
    background-color: #212121;
    align-items: center;
  }

  .live-header {
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
    width: 100%;
    padding: var(--spacing-xl);
    margin: calc(-1 * var(--spacing-xl)) calc(-1 * var(--spacing-xl)) 0;
    background-color: #1a1a1a;
    border-radius: 12px 12px 0 0;
  }

  .live-actions {
    display: flex;
    justify-content: flex-start;
    gap: var(--spacing-m);
    width: 100%;
  }

  .live-header :global(.spectrum-Heading) {
    color: #ffffff;
    margin: 0;
  }

  .live-icon {
    color: #4caf50;
    display: flex;
    align-items: center;
  }

  .url-section {
    width: 100%;
    display: flex;
  }

  .url {
    width: 100%;
  }

  .url-actions {
    margin-left: var(--spacing-m);
    display: flex;
    gap: var(--spacing-m);
    align-items: center;
  }

  .url-action-button {
    cursor: pointer;
  }

  .url-action-button:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  .live-description {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
    text-align: center;
  }

  .live-description :global(.spectrum-Body) {
    color: #bdbdbd;
    margin: 0;
  }

  .tools-tags {
    margin-top: var(--spacing-s);
  }

  .tools-tags :global(.spectrum-Tags) {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-xs);
  }

  .tag-content {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
  }
</style>
