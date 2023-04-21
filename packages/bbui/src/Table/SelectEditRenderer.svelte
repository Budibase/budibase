<script>
  import Checkbox from "../Form/Checkbox.svelte"
  import ActionButton from "../ActionButton/ActionButton.svelte"

  import _ from "../../../builder/lang/i18n"

  export let selected
  export let onEdit
  export let allowSelectRows = false
  export let allowEditRows = false
</script>

<div>
  {#if allowSelectRows}
    <Checkbox value={selected} />
  {/if}
  {#if allowEditRows}
    <ActionButton size="S" on:click={onEdit}
      >{$_("bbui.src.Table.SelectEditRenderer.Edit")}</ActionButton
    >
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
