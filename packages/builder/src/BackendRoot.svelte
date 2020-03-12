<script>
  import BackendNav from "./nav/BackendNav.svelte"
  import SchemaManagementDrawer from "./nav/SchemaManagementDrawer.svelte"
  import Database from "./database/DatabaseRoot.svelte"
  import UserInterface from "./userInterface/UserInterfaceRoot.svelte"
  import ActionsAndTriggers from "./actionsAndTriggers/ActionsAndTriggersRoot.svelte"
  import AccessLevels from "./accessLevels/AccessLevelsRoot.svelte"
  import ComingSoon from "./common/ComingSoon.svelte"

  import { store } from "./builderStore"
  import { setContext } from "svelte"

  let activeNav = "database"
</script>

<div class="root">
  <div class="nav">
    <BackendNav />
  </div>
  <div class="content">
    <Database />
  </div>
  <!-- {:else if activeNav === 'actions'}
      <ActionsAndTriggers />
    {:else if activeNav === 'access levels'}
      <AccessLevels />
    {/if} -->
  <div class="nav">
    <SchemaManagementDrawer />
  </div>
</div>

<style>
  .root {
    height: 100%;
    display: flex;
    background: #fafafa;
  }

  .content {
    flex: 1 1 auto;
    margin: 80px 60px;
  }

  .nav {
    overflow: auto;
    flex: 0 1 auto;
    width: 300px;
    height: 100%;
  }
</style>
