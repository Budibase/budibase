<script>
  import { isActive, url, goto } from "@sveltech/routify"

  export let label = ""
  export let href
</script>

<div
  on:click={() => $goto($url(href))}
  class="budibase__nav-item backend-nav-item"
  class:selected={$isActive(href)}>
  {label}
</div>

<style>
  .backend-nav-item {
    padding-left: 25px;
    cursor: pointer;
  }
</style>
