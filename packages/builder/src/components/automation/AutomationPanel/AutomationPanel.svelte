<script>
  import AutomationList from "./AutomationList.svelte"
  import CreateAutomationModal from "./CreateAutomationModal.svelte"
  import { Icon, Modal, Tabs, Tab } from "@budibase/bbui"
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
  <div class="add-button">
    <Icon hoverable name="AddCircle" on:click={modal.show} />
  </div>
</div>

<style>
  .tab-content-padding {
    padding: 0 var(--spectrum-alias-item-padding-m);
  }
  .add-button {
    position: absolute;
    top: var(--spectrum-alias-item-padding-l);
    bottom: 0;
    right: var(--spectrum-alias-item-padding-l);
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
