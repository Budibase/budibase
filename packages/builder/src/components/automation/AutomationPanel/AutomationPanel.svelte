<script>
  import AutomationList from "./AutomationList.svelte"
  import CreateAutomationModal from "./CreateAutomationModal.svelte"
  import { Modal, Tabs, Tab, Button, Layout } from "@budibase/bbui"

  export let modal
  export let webhookModal
</script>

<div class="nav">
  <Tabs selected="Automations">
    <Tab title="Automations">
      <Layout paddingX="L" paddingY="L" gap="S">
        <Button cta wide on:click={modal.show}>Add automation</Button>
      </Layout>
      <AutomationList />
      <Modal bind:this={modal}>
        <CreateAutomationModal {webhookModal} />
      </Modal>
    </Tab>
  </Tabs>
</div>

<style>
  .nav {
    overflow-y: auto;
    background: var(--background);
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    position: relative;
    border-right: var(--border-light);
    padding-bottom: 60px;
  }
</style>
