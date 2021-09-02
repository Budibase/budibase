<script>
  import { Heading, Body, Layout, Button, Modal } from "@budibase/bbui"
  import { automationStore } from "builderStore"
  import AutomationPanel from "components/automation/AutomationPanel/AutomationPanel.svelte"
  import SetupPanel from "components/automation/SetupPanel/SetupPanel.svelte"
  import CreateAutomationModal from "components/automation/AutomationPanel/CreateAutomationModal.svelte"
  import CreateWebhookModal from "components/automation/shared/CreateWebhookModal.svelte"
  $: automation = $automationStore.selectedAutomation?.automation
  let modal
  let webhookModal
</script>

<!-- routify:options index=3 -->
<div class="root">
  <div class="nav">
    <AutomationPanel {modal} {webhookModal} />
  </div>
  <div class="content">
    {#if automation}
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
            <Heading size="S">You have no automations</Heading>
            <Body size="S">Let's fix that. Call the bots!</Body>
            <Button on:click={() => modal.show()} size="S" cta
              >Create automation</Button
            >
          </Layout>
        </div>
      </div>
    {/if}
  </div>
  {#if $automationStore.selectedAutomation}
    <div class="setup">
      <SetupPanel />
    </div>
  {/if}
  <Modal bind:this={modal}>
    <CreateAutomationModal webhookModal />
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
    grid-template-columns: 260px minmax(510px, 1fr) 260px;
  }

  .nav {
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    border-right: var(--border-light);
    background-color: var(--background);
    padding-bottom: 60px;
  }

  .content {
    position: relative;
    padding: var(--spacing-l) 40px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: var(--spacing-l);
    overflow: hidden;
  }

  .setup {
    padding: var(--spectrum-global-dimension-size-200);
    border-left: var(--border-light);
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: var(--spacing-l);
    background-color: var(--background);
    overflow-y: auto;
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
</style>
