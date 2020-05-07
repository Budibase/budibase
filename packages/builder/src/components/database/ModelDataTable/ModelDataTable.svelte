<script>
  import { onMount, getContext } from "svelte"
  import { store, backendUiStore } from "builderStore"
  import {
    tap,
    get,
    find,
    last,
    compose,
    flatten,
    map,
    remove,
    keys,
    takeRight,
  } from "lodash/fp"
  import Select from "components/common/Select.svelte"
  import ActionButton from "components/common/ActionButton.svelte"
  import TablePagination from "./TablePagination.svelte"
  import { DeleteRecordModal, CreateEditRecordModal } from "./modals"
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

  async function selectRecord(record) {
    return await api.loadRecord(record.key, {
      appname: $store.appname,
      instanceId: $backendUiStore.selectedDatabase.id,
    })
  }

  const ITEMS_PER_PAGE = 10
  // Internal headers we want to hide from the user
  const INTERNAL_HEADERS = ["_id", "_rev", "modelId", "type"]

  let modalOpen = false
  let data = []
  let headers = []
  let views = []
  let currentPage = 0

  $: instanceId = $backendUiStore.selectedDatabase.id

  $: {
    if ($backendUiStore.selectedView) {
      api
        .fetchDataForView($backendUiStore.selectedView, instanceId)
        .then(records => {
          data = records || []
          headers = Object.keys($backendUiStore.selectedModel.schema).filter(
            key => !INTERNAL_HEADERS.includes(key)
          )
        })
    }
  }

  $: paginatedData = data.slice(
    currentPage * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE + ITEMS_PER_PAGE
  )

  onMount(() => {
    if (views.length) {
      backendUiStore.actions.views.select(views[0])
    }
  })
</script>

<section>
  <div class="table-controls">
    <h2 class="title">{$backendUiStore.selectedModel.name}</h2>
  </div>
  <table class="uk-table">
    <thead>
      <tr>
        <th>Edit</th>
        {#each headers as header}
          <th>{header}</th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#if paginatedData.length === 0}
        <div class="no-data">No Data.</div>
      {/if}
      {#each paginatedData as row}
        <tr class="hoverable">
          <td>
            <div class="uk-inline">
              <i class="ri-more-line" />
              <div uk-dropdown="mode: click">
                <ul class="uk-nav uk-dropdown-nav">
                  <li
                    on:click={() => {
                      editRecord(row)
                    }}>
                    <div>Edit</div>
                  </li>
                  <li>
                    <div
                      on:click={() => {
                        deleteRecord(row)
                      }}>
                      Delete
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </td>
          {#each headers as header}
            <td>{row[header]}</td>
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
  .title {
    font-size: 24px;
    font-weight: 600;
    text-rendering: optimizeLegibility;
    text-transform: capitalize;
  }

  table {
    border: 1px solid #ccc;
    background: #fff;
    border-radius: 3px;
    border-collapse: collapse;
  }

  thead {
    background: #f9f9f9;
    border: 1px solid #ccc;
  }

  thead th {
    color: var(--button-text);
    text-transform: capitalize;
    font-weight: 500;
    font-size: 14px;
    text-rendering: optimizeLegibility;
    letter-spacing: 1px;
  }

  tbody tr {
    border-bottom: 1px solid #ccc;
    transition: 0.3s background-color;
    color: var(--secondary100);
    font-size: 14px;
  }

  tbody tr:hover {
    background: #fafafa;
  }

  .table-controls {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-top: 10px;
  }

  .ri-more-line:hover,
  .uk-dropdown-nav li:hover {
    cursor: pointer;
  }

  .no-data {
    padding: 20px;
  }
</style>
