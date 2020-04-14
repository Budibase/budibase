<script>
  import { getContext } from "svelte"
  const { open, close } = getContext("simple-modal")

  import ButtonGroup from "components/common/ButtonGroup.svelte"
  import Button from "components/common/Button.svelte"
  import ActionButton from "components/common/ActionButton.svelte"
  import { store, backendUiStore } from "builderStore"
  import {
    generateFullPermissions,
    getNewAccessLevel,
  } from "components/common/core"
  import getIcon from "components/common/icon"
  import AccessLevelView from "components/accessLevels/AccessLevelView.svelte"

  let editingLevel = null
  let editingLevelIsNew = false
  let allPermissions = []
  store.subscribe(db => {
    allPermissions = generateFullPermissions(db.hierarchy, db.actions)
  })

  const openModal = (level, newLevel) => {
    editingLevel = level
    editingLevelIsNew = newLevel
    open(AccessLevelView, {
      level: editingLevel,
      allPermissions,
      onFinished: onEditingFinished,
      isNew: editingLevelIsNew,
      allLevels: $store.accessLevels.levels,
      hierarchy: $store.hierarchy,
      actions: $store.actions,
      close: close,
      title: "Access Level",
    })
  }

  let cancel = () => {
    editingAction = null
    close()
  }

  let onEditingFinished = level => {
    if (level) {
      store.saveLevel(level, editingLevelIsNew, editingLevel)
    }
    editingLevel = null
    close()
  }

  const getPermissionsString = perms => {
    return `${perms.length} / ${allPermissions.length}`
  }
</script>

<div class="root">
  <ButtonGroup>
    <ActionButton primary on:click={() => openModal(getNewAccessLevel(), true)}>
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
              <span on:click={() => openModal(level, false)}>
                {@html getIcon('edit')}
              </span>
              <span on:click={() => store.deleteLevel(level)}>
                {@html getIcon('trash')}
              </span>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  {:else}(no actions added){/if}

</div>

<style>
  .root {
    height: 100%;
    position: relative;
    padding: 1.5rem;
  }
</style>
