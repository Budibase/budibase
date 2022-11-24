<script>
  export let value
</script>

<div class="text-cell">
  {value || ""}
</div>

<style>
  .text-cell {
    padding: 0 8px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
