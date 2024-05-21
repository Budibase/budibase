<script>
  export let truncate = false
  export let noShrink = false
</script>

<span class:truncate class:noShrink class="block">
  <slot />
</span>

<style>
  .block {
    font-style: italic;
    border-radius: 1px;
    padding: 0px 5px 0px 3px;
    border-radius: 1px;
    background-color: var(--grey-3);
    color: var(--ink);
    word-break: break-word;
  }

  .truncate {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .noShrink {
    flex-shrink: 0;
  }
</style>
