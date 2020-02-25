<script>
  import getIcon from "../common/icon"
  import { store } from "../builderStore"
  import Button from "../common/Button.svelte"
  import ButtonGroup from "../common/ButtonGroup.svelte"
  import ActionView from "./ActionView.svelte"
  import Modal from "../common/Modal.svelte"
  import { pipe } from "../common/core"
  import { keys, map, join } from "lodash/fp"

  export let editingActionIsNew = false
  export let editingAction = null
  export let onActionEdit = action => {}
  export let onActionDelete = action => {}
  export let onActionSave = action => {}
  export let onActionCancel = () => {}

  $: isEditing = editingAction !== null

  let actionsArray = []
  store.subscribe(s => {
    actionsArray = pipe(s.actions, [keys, map(k => s.actions[k])])
  })

  let getDefaultOptionsHtml = defaultOptions =>
    pipe(defaultOptions, [
      keys,
      map(
        k =>
          `<span style="color:var(--slate)">${k}: </span>${JSON.stringify(
            defaultOptions[k]
          )}`
      ),
      join("<br>"),
    ])

  let actionEditingFinished = action => {
    if (action) {
      onActionSave(action)
    } else {
      onActionCancel()
    }
  }
</script>

<h3 class="budibase__title--3">Actions</h3>

{#if actionsArray}
  <table class="fields-table uk-table uk-table-small uk-table-striped">
    <thead>
      <tr>
        <th>Description</th>
        <th>Behaviour Source</th>
        <th>Behaviour Name</th>
        <th>Default Options</th>
        <th />
      </tr>
    </thead>
    <tbody>
      {#each actionsArray as action}
        <tr>
          <td class="table-content">{action.name}</td>
          <td class="table-content">{action.behaviourSource}</td>
          <td class="table-content">{action.behaviourName}</td>
          <td class="table-content">
            {@html getDefaultOptionsHtml(action.initialOptions)}
          </td>
          <td class="edit-button">
            <span on:click={() => onActionEdit(action)}>
              {@html getIcon('edit')}
            </span>
            <span on:click={() => onActionDelete(action)}>
              {@html getIcon('trash')}
            </span>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
{:else}(no actions added){/if}

<Modal
  title={editingActionIsNew ? 'Create Action' : 'Edit Action'}
  bind:isOpen={isEditing}>
  {#if isEditing}
    <ActionView
      action={editingAction}
      allActions={$store.actions}
      onFinished={actionEditingFinished}
      isNew={editingActionIsNew} />
  {/if}
</Modal>

<style>
  .edit-button {
    cursor: pointer;
    color: var(--secondary25);
  }

  tr:hover .edit-button {
    color: var(--secondary75);
  }

  .table-content {
    font-weight: 500;
    font-size: 0.9rem;
  }
</style>
