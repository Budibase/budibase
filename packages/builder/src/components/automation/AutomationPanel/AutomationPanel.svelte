<script>
  import AutomationList from "./AutomationList.svelte"
  import CreateAutomationModal from "./CreateAutomationModal.svelte"
  import { Modal } from "@budibase/bbui"
  let modal
</script>

<div class="title">
  <h1>Automations</h1>
  <i
    on:click={modal.show}
    data-cy="new-automation"
    class="ri-add-circle-fill" />
</div>
<AutomationList />
<Modal bind:this={modal}>
  <CreateAutomationModal />
</Modal>

<style>
  .title {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  .title h1 {
    font-size: var(--font-size-m);
    font-weight: 500;
    margin: 0;
  }
  .title i {
    font-size: 20px;
  }
  .title i:hover {
    cursor: pointer;
    color: var(--blue);
  }
</style>
