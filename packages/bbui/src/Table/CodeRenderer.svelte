<script lang="ts">
  export let value: string
</script>

<code>{value}</code>

<style>
  code {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: var(--max-cell-width);
  }
</style>
