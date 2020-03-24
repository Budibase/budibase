<script>
  import { onMount } from "svelte"
  import { store, backendUiStore } from "../../builderStore"
  import { tap, get, find, last, compose, flatten, map } from "lodash/fp"
  import Select from "../../common/Select.svelte"
  import { getIndexSchema } from "../../common/core"
  import ActionButton from "../../common/ActionButton.svelte"
  import TablePagination from "./TablePagination.svelte"
  import { DeleteRecordModal } from "./modals"
  import * as api from "./api"

  export let selectRecord

  const ITEMS_PER_PAGE = 10

  let selectedView = ""
  let modalOpen = false
  let data = []
  let headers = []
  let views = []
  let currentPage = 0

  $: views = $backendUiStore.selectedRecord
    ? childViewsForRecord($store.hierarchy)
    : $store.hierarchy.indexes

  $: currentAppInfo = {
    appname: $store.appname,
    instanceId: $backendUiStore.selectedDatabase.id,
  }
  // $: data =
  //   $backendUiStore.selectedDatabase &&
  //   $backendUiStore.selectedView.records.slice(
  //     currentPage * ITEMS_PER_PAGE,
  //     currentPage * ITEMS_PER_PAGE + ITEMS_PER_PAGE
  //   )

  $: fetchRecordsForView(
    $backendUiStore.selectedView,
    $backendUiStore.selectedDatabase
  ).then(records => {
    data = records
    headers = getSchema($backendUiStore.selectedView).map(get("name"))
  })

  const childViewsForRecord = compose(
    flatten,
    map("indexes"),
    get("children")
  )

  const getSchema = getIndexSchema($store.hierarchy)

  async function fetchRecordsForView(view, instance) {
    const viewName = $backendUiStore.selectedRecord
      ? `${$backendUiStore.selectedRecord.type}/`
      : view.name
    return await api.fetchDataForView(view.name, {
      appname: $store.appname,
      instanceId: instance.id,
    })
  }

  function drillIntoRecord(record) {
    backendUiStore.update(state => {
      state.selectedRecord = record
      state.breadcrumbs = [state.selectedDatabase.name, record.id]
      return state
    })
  }
</script>

<section>
  <div class="table-controls">
    <h4 class="budibase__title--3">{last($backendUiStore.breadcrumbs)}</h4>
    <Select
      icon="ri-eye-line"
      on:change={e => {
        const view = e.target.value
        backendUiStore.actions.views.select(view)
      }}>
      {#each views as view}
        <option value={view.name}>{view.name}</option>
      {/each}
    </Select>
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
      {#if data.length === 0}
        <div class="no-data">No Data.</div>
      {/if}
      {#each data as row}
        <tr class="hoverable">
          <td>
            <div class="uk-inline">
              <i class="ri-more-line" />
              <div uk-dropdown="mode: click">
                <ul class="uk-nav uk-dropdown-nav">
                  <li>
                    <div on:click={() => drillIntoRecord(row)}>View</div>
                  </li>
                  <li
                    on:click={() => {
                      selectRecord(row)
                      backendUiStore.actions.modals.show('RECORD')
                    }}>
                    <div>Edit</div>
                  </li>
                  <li>
                    <div
                      on:click={() => {
                        selectRecord(row)
                        backendUiStore.actions.modals.show('DELETE_RECORD')
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
    bind:currentPage
    pageItemCount={data.length}
    {ITEMS_PER_PAGE} />
</section>

<style>
  table {
    border: 1px solid #ccc;
    background: #fff;
    border-radius: 3px;
    border-collapse: collapse;
  }

  thead {
    background: var(--background-button);
  }

  thead th {
    color: var(--button-text);
    text-transform: capitalize;
    font-weight: 500;
  }

  tbody tr {
    border-bottom: 1px solid #ccc;
    transition: 0.3s background-color;
    color: var(--darkslate);
  }

  tbody tr:hover {
    background: #fafafa;
  }

  .table-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .ri-more-line:hover,
  .uk-dropdown-nav li:hover {
    cursor: pointer;
  }

  .no-data {
    padding: 20px;
  }
</style>
