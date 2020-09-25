<script>
  export let data
  export let currentPage
  export let pageItemCount
  export let ITEMS_PER_PAGE

  let numPages = 0
  $: numPages = Math.ceil((data?.length ?? 0) / ITEMS_PER_PAGE)

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
    <button on:click={previous} disabled={currentPage === 0}>&lt;</button>
    {#each Array(numPages) as _, idx}
      <button
        class:selected={idx === currentPage}
        on:click={() => selectPage(idx)}>
        {idx + 1}
      </button>
    {/each}
    <button
      on:click={next}
      disabled={currentPage === numPages - 1 || numPages === 0}>
      &gt;
    </button>
  </div>

  <p>
    {#if numPages > 1}
      Showing {ITEMS_PER_PAGE * currentPage + 1} - {ITEMS_PER_PAGE * currentPage + pageItemCount}
      of {data.length} rows
    {:else if numPages === 1}Showing all {data.length} row(s){/if}
  </p>
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
    border: 1px solid var(--grey-4);
    border-radius: var(--border-radius-s);
    overflow: hidden;
  }

  .pagination__buttons button {
    display: inline-block;
    padding: var(--spacing-s) var(--spacing-m);
    margin: 0;
    background: #fff;
    border: none;
    outline: none;
    border-right: 1px solid var(--grey-4);
    text-transform: capitalize;
    min-width: 20px;
    transition: 0.3s background-color;
  }
  .pagination__buttons button:last-child {
    border-right: none;
  }
  .pagination__buttons button:hover {
    cursor: pointer;
    background-color: var(--grey-1);
  }
  .pagination__buttons button.selected {
    background: var(--grey-2);
  }

  p {
    font-size: var(--font-size-s);
    margin: var(--spacing-xl) 0;
  }
</style>
