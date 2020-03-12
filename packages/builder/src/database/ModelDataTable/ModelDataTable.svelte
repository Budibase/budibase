<script>
  import { store } from "../../builderStore"
  import Select from "../../common/Select.svelte"
  import { CreateEditRecordModal, DeleteRecordModal } from "./modals"
  import ActionButton from "../../common/ActionButton.svelte"
  import TablePagination from "./TablePagination.svelte"
  import * as api from "./api"
  import { getIndexSchema } from "../../common/core"

  let pages = [1, 2, 3]

  export let data = [
    { name: "Joe", inStock: true },
    { name: "Mike", inStock: false },
    { name: "Martin", inStock: true },
  ]
  export let headers = ["name", "inStock"]
  // export let pageSize = 10

  let selectedView = ""
  let modalOpen = false
  let deleteRecordModal = false

  $: indexes = $store.hierarchy.indexes

  const getSchema = getIndexSchema($store.hierarchy)
</script>

<CreateEditRecordModal bind:modalOpen />
<DeleteRecordModal modalOpen={deleteRecordModal} />

<section>
  <div class="table-controls">
    <h4 class="budibase__title--3">Shoe database</h4>
    <Select
      icon="ri-eye-line"
      on:change={e => api.fetchDataForView(e.target.value)}>
      {#each indexes as index}
        ({console.log(getSchema(index))})
        <option value={index.name}>{index.name}</option>
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
                  <li>
                    <div on:click={() => (modalOpen = true)}>Edit</div>
                  </li>
                  <li>
                    <div on:click={() => (deleteRecordModal = true)}>Delete</div>
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

  .ri-more-line:hover, .uk-dropdown-nav li:hover{
    cursor: pointer;
  }
</style>
