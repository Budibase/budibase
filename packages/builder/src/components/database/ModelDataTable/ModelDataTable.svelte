<script>
  import { onMount, getContext } from "svelte"
  import { store, backendUiStore } from "builderStore"
  import { Button, Icon } from "@budibase/bbui"
  import Select from "components/common/Select.svelte"
  import ActionButton from "components/common/ActionButton.svelte"
  import LinkedRecord from "./LinkedRecord.svelte"
  import TablePagination from "./TablePagination.svelte"
  import { DeleteRecordModal, CreateEditRecordModal } from "./modals"
  import RowPopover from "./popovers/Row.svelte"
  import ColumnPopover from "./popovers/Column.svelte"
  import ColumnHeaderPopover from "./popovers/ColumnHeader.svelte"
  import * as api from "./api"

  const { open, close } = getContext("simple-modal")

  const editRecord = async row => {
    open(
      CreateEditRecordModal,
      {
        onClosed: close,
        record: row,
      },
      { styleContent: { padding: "0" } }
    )
  }

  const deleteRecord = async row => {
    open(
      DeleteRecordModal,
      {
        onClosed: close,
        record: row,
      },
      { styleContent: { padding: "0" } }
    )
  }

  const ITEMS_PER_PAGE = 10
  // Internal headers we want to hide from the user
  const INTERNAL_HEADERS = ["_id", "_rev", "modelId", "type"]

  let modalOpen = false
  let data = []
  let headers = []
  let views = []
  let currentPage = 0
  let search
  let dropdownLeft

  $: {
    if ($backendUiStore.selectedView) {
      api.fetchDataForView($backendUiStore.selectedView).then(records => {
        data = records || []
      })
    }
  }

  $: paginatedData = data
    ? data.slice(
        currentPage * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE + ITEMS_PER_PAGE
      )
    : []

  $: headers = Object.keys($backendUiStore.selectedModel.schema).filter(
    id => !INTERNAL_HEADERS.includes(id)
  )

  $: schema = $backendUiStore.selectedModel.schema

  const createNewRecord = () => {
    open(
      CreateEditRecordModal,
      {
        onClosed: close,
      },
      { styleContent: { padding: "0" } }
    )
  }

  onMount(() => {
    if (views.length) {
      backendUiStore.actions.views.select(views[0])
    }
  })
</script>

<section>
  <div class="table-controls">
    <h2 class="title">{$backendUiStore.selectedModel.name}</h2>
    <div class="popovers">
      <!-- <Button text small on:click={() => alert('Clicked!')}>
        <Icon name="view" />
        Create New View
      </Button> -->
      <ColumnPopover />
      <RowPopover />
    </div>
  </div>
  <table class="uk-table">
    <thead>
      <tr>
        <th>
          <div>Edit</div>
        </th>
        {#each headers as header}
          <th>
            <ColumnHeaderPopover
              field={$backendUiStore.selectedModel.schema[header]} />
          </th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#if paginatedData.length === 0}
        <div class="no-data">No Data.</div>
      {/if}
      {#each paginatedData as row}
        <tr>
          <td>
            <div class="uk-inline">
              <i class="ri-more-line" />
              <div uk-dropdown="mode: click">
                <ul class="uk-nav uk-dropdown-nav">
                  <li
                    on:click={() => {
                      editRecord(row)
                    }}>
                    <i class="ri-edit-line" />
                    <div class="label">Edit</div>
                  </li>
                  <li
                    on:click={() => {
                      deleteRecord(row)
                    }}>
                    <i class="ri-delete-bin-2-line" />
                    <div class="label">Delete</div>
                  </li>
                </ul>
              </div>
            </div>
          </td>
          {#each headers as header}
            <td class="hoverable">
              {#if schema[header].type === 'link'}
                <LinkedRecord field={schema[header]} ids={row[header]} />
              {:else}{row[header] || ''}{/if}
            </td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
  <TablePagination
    {data}
    bind:currentPage
    pageItemCount={data.length}
    {ITEMS_PER_PAGE} />
</section>

<style>
  section {
    margin-bottom: 20px;
  }
  .title {
    font-size: 24px;
    font-weight: 600;
    text-rendering: optimizeLegibility;
    text-transform: capitalize;
  }

  table {
    border: 1px solid var(--grey-4);
    background: #fff;
    border-radius: 3px;
    border-collapse: collapse;
  }

  thead {
    height: 40px;
    background: var(--grey-3);
    border: 1px solid var(--grey-4);
  }

  thead th {
    color: var(--ink);
    text-transform: capitalize;
    font-weight: 500;
    font-size: 14px;
    text-rendering: optimizeLegibility;
    transition: 0.5s all;
  }

  /* thead th div {
    display: flex;
    justify-content: space-between;
    align-items: center;
  } */

  th:hover {
    color: var(--blue);
  }

  td {
    max-width: 200px;
    text-overflow: ellipsis;
    border: 1px solid var(--grey-4);
  }

  tbody tr {
    border-bottom: 1px solid var(--grey-4);
    transition: 0.3s background-color;
    color: var(--ink);
    font-size: 12px;
  }

  tbody tr:hover {
    background: var(--grey-1);
  }

  .table-controls {
    width: 100%;
  }

  .popovers {
    display: flex;
  }

  .ri-more-line:hover,
  .uk-dropdown-nav li:hover {
    cursor: pointer;
  }

  .no-data {
    padding: 20px;
  }

  li {
    display: flex;
    align-items: center;
    border-radius: 5px;
  }

  i {
    color: var(--grey-7);
    margin-right: 8px;
    font-size: 20px;
  }

  .label {
    color: var(--grey-7);
    font-size: 14px;
    font-family: inter;
    font-weight: 400;
    margin: 12px 0px;
  }
  .label:hover {
    color: var(--ink);
    cursor: pointer;
  }
</style>
