<script>
  import AutomationList from "./AutomationList.svelte"
  import CreateAutomationModal from "./CreateAutomationModal.svelte"
  import { Modal, Tabs, Tab } from "@budibase/bbui"
  let modal
</script>

<div class="title">
  <Tabs selected="Automations">
    <Tab title="Automations">
      <div class="tab-content-padding">
        <AutomationList />
        <Modal bind:this={modal}>
          <CreateAutomationModal />
        </Modal>
      </div>
    </Tab>
  </Tabs>
  <i
    on:click={modal.show}
    data-cy="new-automation"
    class="ri-add-circle-fill" />
</div>

<style>
  .tab-content-padding {
    padding: 0 var(--spacing-xl);
  }

  i {
    font-size: 20px;
    position: absolute;
    top: var(--spacing-l);
    right: var(--spacing-xl);
  }

  .title {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    position: relative;
  }
  .title i {
    font-size: 20px;
  }
  .title i:hover {
    cursor: pointer;
    color: var(--blue);
  }
</style>
