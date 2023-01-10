<script>
  export let value

  let firstName = value?.firstName
  let lastName = value?.lastName || ""

  $: username =
    firstName && lastName ? `${firstName} ${lastName}` : value?.email
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
