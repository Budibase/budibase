<script>
  import Checkbox from "../Form/Checkbox.svelte"
  import ActionButton from "../ActionButton/ActionButton.svelte"

  export let selected
  export let onEdit
  export let allowSelectRows = false
  export let allowEditRows = false
  export let data
</script>

<div>
  {#if allowSelectRows && data.__selectable !== false}
    <Checkbox value={selected} />
  {/if}
  {#if allowEditRows}
    <ActionButton size="S" on:click={onEdit}>Edit</ActionButton>
  {/if}
</div>

<style>
  div {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: var(--spacing-m);
  }
</style>
