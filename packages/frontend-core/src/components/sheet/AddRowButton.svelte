<script>
  import { Icon } from "@budibase/bbui"
  import { getContext } from "svelte"

  const { dispatch, columns } = getContext("sheet")
</script>

{#if $columns.length}
  <div class="add-component" on:click={() => dispatch("add-row")}>
    <Icon size="XL" name="Add" />
  </div>
{/if}

<style>
  .add-component {
    position: absolute;
    bottom: calc(20px + var(--spacing-l));
    right: calc(20px + var(--spacing-xl));
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: var(--spectrum-global-color-blue-500);
    display: grid;
    place-items: center;
    color: white;
    box-shadow: 1px 3px 8px 0 rgba(0, 0, 0, 0.3);
    cursor: pointer;
    transition: transform ease-out 300ms, background ease-out 130ms;
  }
  .add-component:hover {
    background: var(--spectrum-global-color-blue-600);
  }
</style>
