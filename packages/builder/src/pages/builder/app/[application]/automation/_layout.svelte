<script>
  import { Heading, Body, Layout, Button, Modal } from "@budibase/bbui"
  import AutomationPanel from "@/components/automation/AutomationPanel/AutomationPanel.svelte"
  import CreateAutomationModal from "@/components/automation/AutomationPanel/CreateAutomationModal.svelte"
  import CreateWebhookModal from "@/components/automation/Shared/CreateWebhookModal.svelte"
  import { onDestroy } from "svelte"
  import { syncURLToState } from "@/helpers/urlStateSync"
  import * as routify from "@roxi/routify"
  import {
    builderStore,
    automationStore,
    selectedAutomation,
  } from "@/stores/builder"
  import StepPanel from "@/components/automation/AutomationBuilder/StepPanel.svelte"
  import SelectStepSidePanel from "@/components/automation/AutomationBuilder/FlowChart/SelectStepSidePanel.svelte"

  $: automationId = $selectedAutomation?.data?._id
  $: blockRefs = $selectedAutomation.blockRefs
  $: builderStore.selectResource(automationId)

  const stopSyncing = syncURLToState({
    urlParam: "automationId",
    stateKey: "selectedAutomationId",
    validate: id => $automationStore.automations.some(x => x._id === id),
    fallbackUrl: "./index",
    store: automationStore,
    update: automationStore.actions.select,
    routify,
  })

  let modal
  let webhookModal

  onDestroy(stopSyncing)
</script>

<!-- routify:options index=3 -->
<div class="root">
  <AutomationPanel {modal} {webhookModal} />
  <div class="content drawer-container">
    {#if $automationStore.automations?.length}
      <slot />
    {:else}
      <div class="centered">
        <div class="main">
          <Layout gap="S" justifyItems="center">
            <svg
              width="60px"
              height="60px"
              class="spectrum-Icon"
              focusable="false"
            >
              <use xlink:href="#spectrum-icon-18-WorkflowAdd" />
            </svg>
            <Heading size="M">You have no automations</Heading>
            <Body size="M">Let's fix that. Call the bots!</Body>
            <Button on:click={() => modal.show()} size="M" cta>
              Create automation
            </Button>
          </Layout>
        </div>
      </div>
    {/if}
  </div>

  {#if blockRefs[$automationStore.selectedNodeId] && $automationStore.selectedNodeId}
    <div class="step-panel">
      <StepPanel />
    </div>
  {/if}

  {#if $automationStore.actionPanelBlock && !$automationStore.selectedNodeId}
    <SelectStepSidePanel
      block={$automationStore.actionPanelBlock}
      onClose={() => automationStore.actions.closeActionPanel()}
    />
  {/if}

  <Modal bind:this={modal}>
    <CreateAutomationModal {webhookModal} />
  </Modal>
  <Modal bind:this={webhookModal}>
    <CreateWebhookModal />
  </Modal>
</div>

<style>
  .root {
    flex: 1 1 auto;
    height: 0;
    display: grid;
    grid-auto-flow: column dense;
    grid-template-columns: 260px minmax(510px, 1fr) fit-content(500px);
    overflow: hidden;
  }
  .content {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    overflow: auto;
  }
  .centered {
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .main {
    width: 300px;
  }

  .step-panel {
    border-left: var(--border-light);
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    background-color: var(--background);
    overflow: auto;
    grid-column: 3;
    width: 400px;
    max-width: 400px;
  }
</style>
