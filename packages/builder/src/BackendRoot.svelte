<script>
  import BackendNav from "./nav/BackendNav.svelte"
  import BackendRightNav from "./nav/BackendRightNav.svelte"
  import Database from "./database/DatabaseRoot.svelte"
  import UserInterface from "./userInterface/UserInterfaceRoot.svelte"
  import ActionsAndTriggers from "./actionsAndTriggers/ActionsAndTriggersRoot.svelte"
  import AccessLevels from "./accessLevels/AccessLevelsRoot.svelte"
  import ComingSoon from "./common/ComingSoon.svelte"

  import { store } from "./builderStore"

  export let navWidth = "50px"
</script>

<div class="root">
  <div class="nav">
    <BackendNav />
  </div>
  <div class="content">
    {#if $store.activeNav === 'database'}
      <Database />
    {:else if $store.activeNav === 'actions'}
      <ActionsAndTriggers />
    {:else if $store.activeNav === 'access levels'}
      <AccessLevels />
    {/if}
  </div>
  <div class="right-nav">
    <BackendRightNav />
  </div>
</div>



<style>
  .root {
    height: 100%;
    display: flex;
  }

  .content {
    flex: 1 1 auto;
    height: 100%;
    background-color: #fafafa;
    margin: 0;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .nav {
    overflow: auto;
    flex: 0 1 auto;
    width: 275px;
    height: 100%;
  }

  .right-nav {
    overflow: auto;
    flex: 0 auto 1;
    width: 275px;
    height: 100%;
  }
</style>
