<script>
  import { backendUiStore } from "builderStore"

  export let data
  export let currentPage
  export let pageItemCount
  export let ITEMS_PER_PAGE

  let numPages = 0

  $: numPages = Math.ceil(data.length / ITEMS_PER_PAGE)

  const next = () => {
    if (currentPage + 1 === numPages) return
    currentPage = currentPage + 1
  }

  const previous = () => {
    if (currentPage == 0) return
    currentPage = currentPage - 1
  }

  const selectPage = page => {
    currentPage = page
  }
</script>

<div class="pagination">
  <div class="pagination__buttons">
    <button on:click={previous}>Previous</button>
    <button on:click={next}>Next</button>
    {#each Array(numPages) as _, idx}
      <button
        class:selected={idx === currentPage}
        on:click={() => selectPage(idx)}>
        {idx + 1}
      </button>
    {/each}
  </div>
  <p>Showing {pageItemCount} of {data.length} entries</p>
</div>

<style>
  .pagination {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .pagination__buttons {
    display: flex;
  }

  .pagination__buttons button {
    display: inline-block;
    padding: 10px;
    margin: 0;
    background: #fff;
    border: 1px solid #ccc;
    text-transform: capitalize;
    border-radius: 3px;
    font-family: Roboto;
    min-width: 20px;
    transition: 0.3s background-color;
  }

  .pagination__buttons button:hover {
    cursor: pointer;
    background-color: #fafafa;
  }

  .selected {
    color: var(--button-text);
  }
</style>
