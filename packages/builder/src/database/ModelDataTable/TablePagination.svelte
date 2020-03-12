<script>
  export let data = []
</script>

<div class="pagination">
  <div class="pagination__buttons">
    <button>Previous</button>
    <button>Next</button>
    {#each data as page, idx}
      <button>{idx + 1}</button>
    {/each}
  </div>
  <p>Showing 10 (hardcoded, update this) of {data.length} entries</p>
</div>

<style>
  .pagination {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .pagination__buttons button {
    display: inline-block;
    padding: 10px;
    margin: 0;
    background: #fff;
    border: 1px solid #ccc;
    text-transform: capitalize;
    border-radius: 5px;
    font-family: Roboto;
    min-width: 20px;
  }

  .pagination__buttons button:hover {
    cursor: pointer;
  }

  .ri-more-line:hover {
    cursor: pointer;
  }
</style>