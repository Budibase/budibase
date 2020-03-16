<script>
  import { onMount } from "svelte"
  import { store } from "../../builderStore"
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
  let deleteRecordModal = false
  let data = []
  let headers = []
  let selectedRecord

  $: views = $store.hierarchy.indexes
  $: currentAppInfo = {
    appname: $store.appname,
    instanceId: $store.currentInstanceId 
  }

  const getSchema = getIndexSchema($store.hierarchy)

  async function fetchRecordsForView(viewName) {
    const recordsForIndex = await api.fetchDataForView(viewName, currentAppInfo)
    data = recordsForIndex
    headers = Object.keys(data[0])
  }

  onMount(async () => {
    await fetchRecordsForView(views[0].name, currentAppInfo)
  })
</script>

<DeleteRecordModal modalOpen={deleteRecordModal} record={selectedRecord} />

<section>
  <div class="table-controls">
    <h4 class="budibase__title--3">Shoe database</h4>
    <Select
      icon="ri-eye-line"
      on:change={e => fetchRecordsForView(e.target.value)}>
      {#each views as view}
        <!-- ({console.log(getSchema(view))}) ({console.log(view)}) -->
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
        <tr>
          <td>
            <div class="uk-inline">
              <i class="ri-more-line" />
              <div uk-dropdown="mode: click">
                <ul class="uk-nav uk-dropdown-nav">
                  <li>
                    <div>View</div>
                  </li>
                  <li
                    on:click={() => selectRecord(row)}>
                    <div>Edit</div>
                  </li>
                  <li>
                    <div
                      on:click={() => {
                        deleteRecordModal = true
                        selectedRecord = row
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
  <TablePagination {data} />
</section>

<style>
  table {
    border: 1px solid #ccc;
    background: #fff;
    border-radius: 2px;
  }

  thead {
    background: var(--background-button);
  }

  thead th {
    color: var(--button-text);
    text-transform: capitalize;
    font-weight: 500;
  }

  tr {
    border-bottom: 1px solid #ccc;
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
