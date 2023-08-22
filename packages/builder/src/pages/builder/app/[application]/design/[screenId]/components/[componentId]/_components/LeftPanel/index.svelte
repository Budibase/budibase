<script>
  import Screens from "./Screens/index.svelte"
  import Components from "./Components/index.svelte"
</script>

<div class="panel">
  <Screens />
  <div class="divider" />
  <Components />
</div>

<style>
  .panel {
    width: 310px;
    height: 100%;
    border-right: 2px solid var(--grey-2);
    display: flex;
    flex-direction: column;
    background: var(--background);
  }

  .divider {
    border-bottom: 2px solid var(--grey-2);
  }
</style>
