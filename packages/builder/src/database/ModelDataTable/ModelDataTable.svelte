<script>
  let pages = [1, 2, 3]

  export let data = []
  export let pageSize = 10
</script>

<section>
  <table class="uk-table">
    <caption>Shoe Database</caption>
    <thead>
      <tr>
        <th>Table Heading</th>
        <th>Table Heading</th>
        <th>Table Heading</th>
      </tr>
    </thead>
    <tfoot>
      <tr>
        <td>Table Footer</td>
        <td>Table Footer</td>
        <td>Table Footer</td>
      </tr>
    </tfoot>
    <tbody>
      <tr>
        <td>Table Data</td>
        <td>Table Data</td>
        <td>Table Data</td>
      </tr>
      <tr>
        <td>Table Data</td>
        <td>Table Data</td>
        <td>Table Data</td>
      </tr>
    </tbody>
  </table>
  <div class="pagination">
    <button>Previous</button>
    <button>Next</button>
    {#each data as page}
      <button>{page}</button>
    {/each}
  </div>
</section>

<style>
  table {
    border: 1px solid #ccc;
  }

  thead {
    background: var(--background-button);
  }

  thead th {
    color: var(--button-text);
    text-transform: capitalize;
  }
  tr {
    border-bottom: 1px solid #ccc;
  }
</style>