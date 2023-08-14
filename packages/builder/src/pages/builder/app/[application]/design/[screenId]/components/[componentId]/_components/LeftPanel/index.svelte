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
    border-right: 1px solid var(--grey-2);
    display: flex;
    flex-direction: column;
  }

  .divider {
    border-bottom: 1px solid var(--grey-2);
  }
</style>
