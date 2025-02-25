<script lang="ts">
  import Checkbox from "../Form/Checkbox.svelte"
  import ActionButton from "../ActionButton/ActionButton.svelte"

  export let selected: boolean | undefined
  export let onEdit: (_e: Event) => void
  export let allowSelectRows: boolean = false
  export let allowEditRows: boolean = false
  export let data: Record<string, any>
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
