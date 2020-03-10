<script>
  import Select from "../../common/Select.svelte"
  import ActionButton from "../../common/ActionButton.svelte"

  let pages = [1, 2, 3]

  export let data = [
    { name: "Joe", inStock: true },
    { name: "Mike", inStock: false },
    { name: "Martin", inStock: true },
  ]
  export let headers = ["name", "inStock"]
  export let pageSize = 10
</script>

<section>
  <h4 class="budibase__title--3">Shoe database</h4>
  <div class="table-controls">
    <Select />
    <ActionButton primary>Create new record</ActionButton>
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
            <i class="ri-more-line" />
          </td>
          {#each headers as header}
            <td>{row[header]}</td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
  <div class="pagination">
    <button>Previous</button>
    <button>Next</button>
    <!-- {#each data as page}
      <button>{page}</button>
    {/each} -->
  </div>
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
</style>
