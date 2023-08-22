<script>
  import Screens from "./Screens/index.svelte"
  import Components from "./Components/index.svelte"
  import { selectedScreen } from "builderStore"
</script>

<div class="panel">
  <Screens />
  <div class="divider" />
  {#if $selectedScreen}
    <Components />
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
  }

  .divider {
    border-bottom: var(--border-light);
  }
</style>
