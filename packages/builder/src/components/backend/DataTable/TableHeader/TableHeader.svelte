<script>
  import { onMount, onDestroy } from "svelte"
  import { Modal, ModalContent } from "@budibase/bbui"
  import CreateEditColumn from "../modals/CreateEditColumn.svelte"
  import { FIELDS } from "constants/backend"

  const SORT_ICON_MAP = {
    asc: "ri-arrow-down-fill",
    desc: "ri-arrow-up-fill",
  }

  export let field
  export let displayName
  export let column
  export let enableSorting = true
  export let showColumnMenu
  export let progressSort
  export let editable

  let menuButton
  let sortDirection = ""
  let modal
  let hovered
  let filterActive

  function toggleMenu() {
    showColumnMenu(menuButton)
  }

  function onSort(event) {
    progressSort(event.shiftKey)
  }

  function showModal() {
    modal.show()
  }

  function setSort() {
    sortDirection = column.getSort()
  }

  function setFilterActive(e) {
    filterActive = e.column.filterActive
  }

  onMount(() => {
    column.addEventListener("sortChanged", setSort)
    column.addEventListener("filterActiveChanged", setFilterActive)
  })

  onDestroy(() => {
    column.removeEventListener("sortChanged", setSort)
    column.removeEventListener("filterActiveChanged", setFilterActive)
  })

  $: type = FIELDS[field?.type?.toUpperCase()]?.name
</script>

<header
  on:click={onSort}
  data-cy="table-header"
  on:mouseover={() => (hovered = true)}
  on:mouseleave={() => (hovered = false)}>
  <div class="column-header">
    {#if field.autocolumn}<i class="auto ri-magic-fill" />{/if}
    <div class="column-header-text">
      <div class="column-header-name">{displayName}</div>
      {#if type}
        <div class="column-header-type">{type}</div>
      {/if}
    </div>
    <i class={`${SORT_ICON_MAP[sortDirection]} icon`} />
  </div>
  <Modal bind:this={modal}>
    <ModalContent
      showCancelButton={false}
      showConfirmButton={false}
      title={`Edit Column: ${field.name}`}>
      <CreateEditColumn onClosed={modal.hide} {field} />
    </ModalContent>
  </Modal>
  <section class:show={hovered || filterActive}>
    {#if editable && hovered}
      <span on:click|stopPropagation={showModal}>
        <i class="ri-pencil-line icon" />
      </span>
    {/if}
    <span on:click|stopPropagation={toggleMenu} bind:this={menuButton}>
      <i class="ri-filter-line icon" class:active={filterActive} />
    </span>
  </section>
</header>

<style>
  header {
    font-family: Inter;
    font-weight: 600;
    display: flex;
    justify-content: space-between;
    height: 100%;
    width: 100%;
    align-items: center;
    color: var(--ink);
  }

  section {
    opacity: 0;
    transition: 0.3s all;
  }

  section.show {
    opacity: 1;
  }

  .column-header {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: var(--spacing-s);
  }

  .column-header-text {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: var(--spacing-xs);
  }

  .column-header-name {
    white-space: normal !important;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
  }

  .column-header-type {
    font-size: var(--font-size-xs);
    color: var(--grey-6);
  }

  .icon {
    transition: 0.2s all;
    font-size: var(--font-size-m);
    font-weight: 500;
  }
  .auto {
    font-size: var(--font-size-xs);
    transition: none;
    margin-right: 6px;
    margin-top: 2px;
  }

  .icon:hover {
    color: var(--blue);
  }

  .icon.active,
  .icon:hover {
    color: var(--blue);
  }
</style>
