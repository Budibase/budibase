<script>
  import Checkbox from "../Form/Checkbox.svelte"
  import ActionButton from "../ActionButton/ActionButton.svelte"

  export let selected
  export let onToggleSelection
  export let onEdit
  export let allowSelectRows = false
  export let allowEditRows = false
</script>

{#if allowSelectRows}
  <Checkbox value={selected} />
{/if}
{#if allowEditRows}
  <ActionButton size="S" on:click={onEdit}>Edit</ActionButton>
{/if}
