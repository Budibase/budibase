<script>
  import { onMount } from "svelte"
  import { store, backendUiStore } from "builderStore"
  import { notifier } from "builderStore/store/notifications"
  import { Modal, ModalContent, Icon } from "@budibase/bbui"
  import ColumnHeaderPopover from "../popovers/ColumnPopover.svelte"
  import CreateEditColumnPopover from "../popovers/CreateEditColumnPopover.svelte"

  const SORT_ICON_MAP = {
    asc: "ri-arrow-down-fill",
    desc: "ri-arrow-up-fill",
  }

  export let field
  export let column
  export let gridApi
  export let enableMenu = true
  export let enableSorting = true
  export let showColumnMenu
  export let progressSort

  let menuButton
  let sortDirection = ""
  let modal

  let originalName = field.name
  let primaryDisplay =
    $backendUiStore.selectedTable.primaryDisplay == null ||
    $backendUiStore.selectedTable.primaryDisplay === field.name

  function toggleMenu() {
    showColumnMenu(menuButton)
  }

  function onSort(event) {
    progressSort(event.shiftKey)
  }

  function showModal() {
    modal.show()
  }

  async function saveColumn() {
    backendUiStore.update(state => {
      backendUiStore.actions.tables.saveField({
        originalName,
        field,
        primaryDisplay,
      })
      return state
    })
    notifier.success(`Column ${field.name} saved successfully.`)
    modal.hide()
  }

  onMount(() => {
    column.addEventListener("sortChanged", () => {
      sortDirection = column.getSort()
    })
  })
</script>

<header on:click={onSort}>
  <div>
    <span>{field.name}</span>
    {#if enableSorting && sortDirection}
      <i class={SORT_ICON_MAP[sortDirection]} />
    {/if}
  </div>
  <Modal bind:this={modal}>
    <ModalContent
      title={`Edit Column: ${field.name}`}
      confirmText={'Save Column'}
      onConfirm={saveColumn}>
      <CreateEditColumnPopover {field} />
    </ModalContent>
  </Modal>
  <div>
    <span on:click|stopPropagation={showModal}>
      <i class="ri-pencil-line" />
    </span>
    <span on:click|stopPropagation={toggleMenu} bind:this={menuButton}>
      <i class="ri-filter-line" />
    </span>
  </div>
</header>

<style>
  header {
    font-family: Inter;
    display: flex;
    justify-content: space-between;
    height: 100%;
    width: 100%;
    align-items: center;
  }
</style>
