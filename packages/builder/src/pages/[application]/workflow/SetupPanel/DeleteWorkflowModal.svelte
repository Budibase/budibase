<script>
  import { store, backendUiStore, workflowStore } from "builderStore"
  import api from "builderStore/api"
  import ActionButton from "components/common/ActionButton.svelte"

  export let onClosed

  let name

  $: valid = !!name
  $: instanceId = $backendUiStore.selectedDatabase._id

  async function deleteWorkflow() {
    await workflowStore.actions.delete({
      instanceId,
      workflow: $workflowStore.currentWorkflow.workflow,
    })
    onClosed()
  }
</script>

<header>
  <i class="ri-stackshare-line" />
  Delete Workflow
</header>
<div>
  <p>
    Are you sure you want to delete this workflow? This action can't be undone.
  </p>
</div>
<footer>
  <a href="https://docs.budibase.com">
    <i class="ri-information-line" />
    Learn about workflows
  </a>
  <ActionButton on:click={onClosed}>Cancel</ActionButton>
  <ActionButton alert on:click={deleteWorkflow}>Delete</ActionButton>
</footer>

<style>
  header {
    font-size: 24px;
    color: var(--font);
    font-weight: bold;
    padding: 30px;
  }

  header i {
    margin-right: 10px;
    font-size: 20px;
    background: var(--secondary);
    color: var(--dark-grey);
    padding: 8px;
  }

  div {
    padding: 0 30px 30px 30px;
  }

  label {
    font-size: 18px;
    font-weight: 500;
  }

  footer {
    display: grid;
    grid-auto-flow: column;
    grid-gap: 5px;
    grid-auto-columns: 3fr 1fr 1fr;
    padding: 20px;
    background: #fafafa;
    border-radius: 0.5rem;
  }

  footer a {
    color: var(--primary);
    font-size: 14px;
    vertical-align: middle;
    display: flex;
    align-items: center;
  }

  footer i {
    font-size: 20px;
    margin-right: 10px;
  }
</style>
