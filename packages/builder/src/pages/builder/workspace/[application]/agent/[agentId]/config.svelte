<script lang="ts">
  import TopBar from "@/components/common/TopBar.svelte"
  import { agentsStore, aiConfigsStore } from "@/stores/portal"
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
    IconPicker,
  } from "@budibase/bbui"
  import { onMount } from "svelte"
  import { bb } from "@/stores/bb"

  $: currentAgent = $agentsStore.agents.find(
    a => a._id === $agentsStore.currentAgentId
  )

  $: draft = {
    name: currentAgent?.name || "",
    description: currentAgent?.description || "",
    aiconfig: currentAgent?.aiconfig || "",
    goal: "",
    promptInstructions: currentAgent?.promptInstructions || "",
    icon: currentAgent?.icon || "",
  }

  $: aiConfigs = $aiConfigsStore.customConfigs
  $: modelOptions = aiConfigs.map(config => ({
    label: config.name || config._id || "Unnamed",
    value: config._id || "",
  }))

  // async function saveAgent() {
  //   if (!currentAgent) return

  //   try {
  //     await agentsStore.updateAgent({
  //       ...currentAgent,
  //       name: draft.name,
  //       description: draft.description,
  //       aiconfig: draft.aiconfig,
  //       promptInstructions: draft.promptInstructions,
  //       icon: draft.icon,
  //     })
  //     notifications.success("Agent saved successfully")
  //   } catch (error) {
  //     console.error(error)
  //     notifications.error("Error saving agent")
  //   }
  // }

  async function setAgentLive() {
    if (!currentAgent) return

    try {
      await agentsStore.updateAgent({
        ...currentAgent,
        live: true,
      })
      notifications.success("Agent is now live")
      await agentsStore.fetchAgents()
    } catch (error) {
      console.error(error)
      notifications.error("Error setting agent live")
    }
  }

  onMount(async () => {
    await agentsStore.init()
    await aiConfigsStore.fetch()
  })
</script>

<div class="config-wrapper">
  <TopBar
    breadcrumbs={[
      { text: "Agents", url: "../" },
      { text: currentAgent?.name || "Agent" },
    ]}
    icon="Effect"
  />
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
            <IconPicker
              value={draft.icon}
              on:change={e => (draft.icon = e.detail)}
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

          <div class="section section-banner">
            <div class="section-header">
              <Heading size="XS">Variables / Bindings</Heading>
              <Body size="S" color="var(--spectrum-global-color-gray-700)">
                Add variables to your agent. For example, employee_name,
                product, ticket_status.
              </Body>
            </div>
            <div class="add-button">
              <ActionButton size="S" icon="plus">Add</ActionButton>
            </div>
          </div>

          <div class="section section-banner">
            <div class="section-header">
              <Heading size="XS">Tools</Heading>
              <Body size="S" color="var(--spectrum-global-color-gray-700)">
                Give your agent access to internal and external tools so it can
                complete tasks.
              </Body>
            </div>
            <div class="add-button">
              <ActionButton size="S" icon="plus">Add</ActionButton>
            </div>
          </div>

          <div class="section section-banner">
            <div class="section-header">
              <Heading size="XS">Guardrails</Heading>
              <Body size="S" color="var(--spectrum-global-color-gray-700)">
                Train your agent to deliver accurate, consistent answers across
                every workflow.
              </Body>
            </div>
            <div class="add-button">
              <ActionButton size="S" icon="plus">Add</ActionButton>
            </div>
          </div>

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

      <div class="config-footer">
        <div class="live-banner">
          <Button cta icon="play" on:click={setAgentLive}>
            Set your agent live
          </Button>
        </div>
        <Body size="S" color="var(--spectrum-global-color-gray-700)">
          Once your agent is live, it will be available to use within
          automations. You can pause your agent at any time.
        </Body>
      </div>
    </div>
  </div>
</div>

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
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    padding: var(--spacing-m);
    border-radius: 12px;
    background-color: var(--background-alt);
    border: 1px dashed var(--spectrum-global-color-gray-300);
  }

  .section-header {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
    max-width: 70%;
  }

  .add-button {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  .config-footer {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-s);
    margin-top: var(--spacing-xl);
    padding: var(--spacing-l);
    border-radius: 12px;
    background-color: var(--background-alt);
    border: 1px solid var(--spectrum-global-color-gray-300);
    align-items: center;
    text-align: center;
  }

  .live-banner {
    padding: 0;
  }
</style>
