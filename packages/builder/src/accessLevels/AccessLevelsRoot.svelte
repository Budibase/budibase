<script>
  import ButtonGroup from "../common/ButtonGroup.svelte"
  import Button from "../common/Button.svelte"
  import ActionButton from "../common/ActionButton.svelte"
  import { store, backendUiStore } from "../builderStore"
  import { generateFullPermissions, getNewAccessLevel } from "../common/core"
  import getIcon from "../common/icon"
  import AccessLevelView from "./AccessLevelView.svelte"
  import Modal from "../common/Modal.svelte"

  let editingLevel = null
  let editingLevelIsNew = false
  $: { 
    if (editingLevel !== null) {
      backendUiStore.actions.modals.show("ACCESS_LEVELS")
    }
  }
  $: modalOpen = $backendUiStore.visibleModal === 'ACCESS_LEVELS'

  let allPermissions = []
  store.subscribe(db => {
    allPermissions = generateFullPermissions(db.hierarchy, db.actions)
  })

  let onLevelEdit = level => {
    editingLevel = level
    editingLevelIsNew = false
  }

  let onLevelCancel = () => {
    editingAction = null
  }

  let onLevelDelete = level => {
    store.deleteLevel(level)
  }

  let createNewLevel = () => {
    editingLevelIsNew = true
    editingLevel = getNewAccessLevel()
  }

  let onEditingFinished = level => {
    if (level) {
      store.saveLevel(level, editingLevelIsNew, editingLevel)
    }
    editingLevel = null
    backendUiStore.actions.modals.hide()
  }

  const getPermissionsString = perms => {
    return `${perms.length} / ${allPermissions.length}`
  }
</script>

<div class="root">
  <ButtonGroup>
    <ActionButton primary on:click={createNewLevel}>
      Create New Access Level
    </ActionButton>
  </ButtonGroup>

  {#if $store.accessLevels}
    <table class="fields-table uk-table uk-table-small">
      <thead>
        <tr>
          <th>Name</th>
          <th>Permissions</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {#each $store.accessLevels.levels as level}
          <tr>
            <td>{level.name}</td>
            <td>{getPermissionsString(level.permissions)}</td>
            <td class="edit-button">
              <span on:click={() => onLevelEdit(level)}>
                {@html getIcon('edit')}
              </span>
              <span on:click={() => onLevelDelete(level)}>
                {@html getIcon('trash')}
              </span>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  {:else}(no actions added){/if}

  <Modal
    onClosed={backendUiStore.actions.modals.hide}
    bind:isOpen={modalOpen}
    title={modalOpen ? 'Edit Access Level' : 'Create Access Level'}>
      <AccessLevelView
        level={editingLevel}
        {allPermissions}
        onFinished={onEditingFinished}
        isNew={editingLevelIsNew}
        allLevels={$store.accessLevels.levels}
        hierarchy={$store.hierarchy}
        actions={$store.actions} 
      />
  </Modal>

</div>

<style>
  .root {
    height: 100%;
    position: relative;
    padding: 1.5rem;
  }
</style>
