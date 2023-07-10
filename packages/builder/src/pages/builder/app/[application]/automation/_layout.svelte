<script>
  import { Heading, Body, Layout, Button, Modal } from "@budibase/bbui"
  import { automationStore, selectedAutomation } from "builderStore"
  import AutomationPanel from "components/automation/AutomationPanel/AutomationPanel.svelte"
  import CreateAutomationModal from "components/automation/AutomationPanel/CreateAutomationModal.svelte"
  import CreateWebhookModal from "components/automation/Shared/CreateWebhookModal.svelte"
  import TestPanel from "components/automation/AutomationBuilder/TestPanel.svelte"
  import { onDestroy, onMount } from "svelte"
  import { syncURLToState } from "helpers/urlStateSync"
  import * as routify from "@roxi/routify"
  import { store } from "builderStore"

  $: automationId = $selectedAutomation?._id
  $: store.actions.websocket.selectResource(automationId)

  // Keep URL and state in sync for selected screen ID
  const stopSyncing = syncURLToState({
    urlParam: "automationId",
    stateKey: "selectedAutomationId",
    validate: id => $automationStore.automations.some(x => x._id === id),
    fallbackUrl: "./index",
    store: automationStore,
    up: automationStore.actions.select,
    routify,
  })

  let modal
  let webhookModal

  onMount(() => {
    $automationStore.showTestPanel = false
  })

  onDestroy(stopSyncing)
</script>

<!-- routify:options index=3 -->
<div class="root">
  <AutomationPanel {modal} {webhookModal} />
  <div class="content">
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

  {#if $automationStore.showTestPanel}
    <div class="setup">
      <TestPanel automation={$selectedAutomation} />
    </div>
  {/if}
  <Modal bind:this={modal}>
    <CreateAutomationModal {webhookModal} />
  </Modal>
  <Modal bind:this={webhookModal} width="30%">
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
    gap: var(--spacing-l);
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

  .setup {
    padding-top: var(--spectrum-global-dimension-size-200);
    border-left: var(--border-light);
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: var(--spacing-l);
    background-color: var(--background);
    grid-column: 3;
    overflow: auto;
  }
</style>
