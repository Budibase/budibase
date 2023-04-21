<script>
  import { Icon } from "@budibase/bbui"
  import { getContext } from "svelte"

  const { dispatch } = getContext("grid")
</script>

<div class="floating-add-row" on:click={() => dispatch("add-row-inline")}>
  <Icon name="Add" size="L" color="white" />
</div>

<style>
  .floating-add-row {
    position: absolute;
    bottom: 32px;
    left: 32px;
    height: 50px;
    width: 50px;
    border-radius: 50%;
    background: var(--spectrum-global-color-blue-400);
    display: grid;
    place-items: center;
  }
  .floating-add-row:hover {
    background: var(--spectrum-global-color-blue-500);
    cursor: pointer;
  }
</style>
