<script>
  export let value
  $: username = value?.firstName
    ? `${value?.firstName} ${value?.lastName}`
    : value?.email
</script>

<div class="cell">
  {#if value != null}
    <div>{username}</div>
  {/if}
</div>

<style>
  .cell {
    display: flex;
    flex-direction: row;
    gap: var(--spacing-m);
    align-items: center;
  }
</style>
