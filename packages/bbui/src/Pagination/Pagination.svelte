<script lang="ts">
  import "@spectrum-css/pagination/dist/index-vars.css"
  import "@spectrum-css/actionbutton/dist/index-vars.css"
  import "@spectrum-css/typography/dist/index-vars.css"
  import Icon from "../Icon/Icon.svelte"

  export let page: number
  export let goToPrevPage: () => void
  export let goToNextPage: () => void
  export let hasPrevPage: boolean = true
  export let hasNextPage: boolean = true
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<nav class="spectrum-Pagination spectrum-Pagination--explicit">
  <div
    class="spectrum-ActionButton spectrum-ActionButton--sizeM spectrum-ActionButton--quiet spectrum-Pagination-prevButton"
    on:click={hasPrevPage ? goToPrevPage : null}
    class:is-disabled={!hasPrevPage}
  >
    <Icon name="caret-left" size="M" />
  </div>
  <span class="spectrum-Body--secondary spectrum-Pagination-counter">
    Page {page}
  </span>
  <div
    class="spectrum-ActionButton spectrum-ActionButton--sizeM spectrum-ActionButton--quiet spectrum-Pagination-nextButton"
    on:click={hasNextPage ? goToNextPage : null}
    class:is-disabled={!hasNextPage}
  >
    <Icon name="caret-right" size="M" />
  </div>
</nav>

<style>
  .spectrum-Pagination-counter {
    margin-left: 0;
    user-select: none;
  }
  .is-disabled:hover {
    cursor: initial;
  }
</style>
