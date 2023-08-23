<script>
  import ScreenList from "./ScreenList/index.svelte"
  import ComponentList from "./ComponentList/index.svelte"
  import { selectedScreen } from "builderStore"
</script>

<div class="panel">
  <ScreenList />
  {#if $selectedScreen}
    <ComponentList />
  {/if}
</div>

<style>
  .panel {
    width: 310px;
    height: 100%;
    border-right: var(--border-light);
    display: flex;
    flex-direction: column;
    background: var(--background);
    position: relative;
  }
</style>
