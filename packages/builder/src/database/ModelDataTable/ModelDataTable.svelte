<script>
  import { onMount } from "svelte"
  import { store, backendUiStore } from "../../builderStore"
  import Select from "../../common/Select.svelte"
  import { getIndexSchema } from "../../common/core"
  import ActionButton from "../../common/ActionButton.svelte"
  import TablePagination from "./TablePagination.svelte"
  import { DeleteRecordModal } from "./modals"
  import * as api from "./api"

  export let selectRecord

  let pages = [1, 2, 3]
  let selectedView = ""
  let modalOpen = false
  let headers = []
  let selectedRecord

  $: views = $store.hierarchy.indexes
  $: currentAppInfo = {
    appname: $store.appname,
    instanceId: $store.currentInstanceId 
  }
  $: data = $backendUiStore.selectedView.records
  $: deleteRecordModal = $backendUiStore.visibleModal === "DELETE_RECORD"

  const getSchema = getIndexSchema($store.hierarchy)

  async function fetchRecordsForView(viewName) {
    const recordsForIndex = await api.fetchDataForView(viewName, currentAppInfo)
    backendUiStore.update(state => {
      state.selectedView.records = recordsForIndex
      if (state.selectedView.records.length > 0) {
        headers = Object.keys(recordsForIndex[0])
      }
      return state
    })
  }

  onMount(async () => {
    if (views.length > 0) {
      await fetchRecordsForView(views[0].name, currentAppInfo)
    }
  })
</script>

<section>
  <div class="table-controls">
    <h4 class="budibase__title--3">Shoe database</h4>
    <Select
      icon="ri-eye-line"
      on:change={e => fetchRecordsForView(e.target.value)}>
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
      {#each data as row}
        <tr class="hoverable">
          <td>
            <div class="uk-inline">
              <i class="ri-more-line" />
              <div uk-dropdown="mode: click">
                <ul class="uk-nav uk-dropdown-nav">
                  <li>
                    <div>View</div>
                  </li>
                  <li
                    on:click={() => { 
                      selectRecord(row)
                      backendUiStore.actions.modals.show("RECORD")
                    }}>
                    <div>Edit</div>
                  </li>
                  <li>
                    <div
                      on:click={() => {
                        selectRecord(row)
                        backendUiStore.actions.modals.show("DELETE_RECORD")
                      }}>
                      Delete
                    </div>
                  </li>
                  <li>
                    <div>Duplicate</div>
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
  <TablePagination />
</section>

<style>
  table {
    border: 1px solid #ccc;
    background: #fff;
    border-radius: 3px;
    border-collapse: separate;
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
</style>
