<script>
  export let row

  $: baseTrig = row?.trigger || "manual"
  $: type = row?.type || "backup"
  $: trigger = baseTrig.charAt(0).toUpperCase() + baseTrig.slice(1)
</script>

<div class="cell">
  {trigger}
  {type}
</div>

<style>
  .cell {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
</style>
