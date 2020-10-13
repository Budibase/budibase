<script>
  export let data
  export let currentPage = 0
  export let pageItemCount
  export let ITEMS_PER_PAGE

  let numPages = 0
  $: numPages = Math.ceil((data?.length ?? 0) / ITEMS_PER_PAGE)
  $: displayAllPages = numPages <= 10
  $: pagesAroundCurrent = getPagesAroundCurrent(currentPage, numPages)

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

  function getPagesAroundCurrent(current, max) {
    const start = Math.max(current - 2, 1)
    const end = Math.min(current + 2, max - 2)
    let pages = []
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    return pages
  }
</script>

<div class="pagination">
  <div class="pagination__buttons">
    <button on:click={previous} disabled={currentPage === 0}>&lt;</button>
    {#if displayAllPages}
      {#each Array(numPages) as _, idx}
        <button
          class:selected={idx === currentPage}
          on:click={() => selectPage(idx)}>
          {idx + 1}
        </button>
      {/each}
    {:else}
      <button class:selected={currentPage === 0} on:click={() => selectPage(0)}>
        1
      </button>
      {#if currentPage > 3}
        <button disabled>...</button>
      {/if}
      {#each pagesAroundCurrent as idx}
        <button
          class:selected={idx === currentPage}
          on:click={() => selectPage(idx)}>
          {idx + 1}
        </button>
      {/each}
      {#if currentPage < numPages - 4}
        <button disabled>...</button>
      {/if}
      <button
        class:selected={currentPage === numPages - 1}
        on:click={() => selectPage(numPages - 1)}>
        {numPages}
      </button>
    {/if}
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
    padding: var(--spacing-s) 0;
    text-align: center;
    margin: 0;
    background: #fff;
    border: none;
    outline: none;
    border-right: 1px solid var(--grey-4);
    text-transform: capitalize;
    min-width: 20px;
    transition: 0.3s background-color;
    font-family: var(--font-sans);
    color: var(--grey-6);
    width: 40px;
  }
  .pagination__buttons button:last-child {
    border-right: none;
  }
  .pagination__buttons button:hover {
    cursor: pointer;
    background-color: var(--grey-1);
  }
  .pagination__buttons button.selected {
    background: var(--blue);
    color: white;
  }

  p {
    font-size: var(--font-size-s);
    margin: var(--spacing-xl) 0;
    color: var(--grey-6);
  }
</style>
