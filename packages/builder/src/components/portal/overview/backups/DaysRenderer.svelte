<script>
  export let value
  $: console.log(value)
</script>

<div class="cell">
  {value}
  {`day${value == 1 ? "" : "s"} ago`}
</div>

<style>
  .cell {
    display: flex;
    flex-direction: row;
    gap: var(--spacing-m);
    align-items: center;
  }
</style>
