<script>
  export let truncate = false
</script>

<span class:truncate class="block">
  <slot />
</span>

<style>
  .block {
    font-style: italic;
    padding: 0px 3px;
    border-radius: 1px;
    background-color: var(--grey-3);
    color: var(--ink);
    word-break: break-all;
  }

  .truncate {
    display: inline-block;
    max-width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
