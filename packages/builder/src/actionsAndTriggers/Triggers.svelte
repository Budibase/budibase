<script>
  import { store } from "../builderStore"
  import getIcon from "../common/icon"
  import Button from "../common/Button.svelte"
  import Modal from "../common/Modal.svelte"
  import TriggerView from "./TriggerView.svelte"

  export let editingTrigger = null
  export let editingTriggerIsNew = true
  export let onTriggerEdit = trigger => {}
  export let onTriggerDelete = trigger => {}
  export let onTriggerSave = trigger => {}
  export let onTriggerCancel = () => {}

  $: isEditing = editingTrigger !== null

  let triggerEditingFinished = trigger => {
    if (trigger) {
      onTriggerSave(trigger)
    } else {
      onTriggerCancel()
    }
  }
</script>

<h3 class="title">Triggers</h3>

{#if $store.triggers}
  <table class="fields-table uk-table uk-table-small uk-table-striped">
    <thead>
      <tr>
        <th>Event</th>
        <th>Action</th>
        <th>Condition</th>
        <th>Create Options</th>
        <th />
      </tr>
    </thead>
    <tbody>
      {#each $store.triggers as trigger}
        <tr>
          <td class="table-content">{trigger.eventName}</td>
          <td class="table-content">{trigger.actionName}</td>
          <td class="table-content">{trigger.condition}</td>
          <td class="table-content">{trigger.optionsCreator}</td>
          <td class="edit-button">
            <span on:click={() => onTriggerEdit(trigger)}>
              {@html getIcon('edit')}
            </span>
            <span on:click={() => onTriggerDelete(trigger)}>
              {@html getIcon('trash')}
            </span>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
{:else}(no triggers added){/if}

<Modal bind:isOpen={isEditing}>
  {#if isEditing}
    <TriggerView
      trigger={editingTrigger}
      allActions={$store.actions}
      allTriggers={$store.triggers}
      onFinished={triggerEditingFinished}
      isNew={editingTriggerIsNew} />
  {/if}
</Modal>

<style>
  .edit-button {
    cursor: pointer;
    color: var(--secondary25);
  }

  .title {
    margin: 3rem 0rem 0rem 0rem;
    font-weight: 700;
  }

  .table-content {
    font-weight: 500;
    font-size: 0.9rem;
  }

  tr:hover .edit-button {
    color: var(--secondary75);
  }
</style>
