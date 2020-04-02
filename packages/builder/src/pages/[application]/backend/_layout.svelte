<script>
  import BackendNav from "components/nav/BackendNav.svelte"
  import SchemaManagementDrawer from "components/nav/SchemaManagementDrawer.svelte"
  import Database from "components/database/DatabaseRoot.svelte"
  import UserInterface from "components/userInterface/UserInterfaceRoot.svelte"
  import ActionsAndTriggers from "components/actionsAndTriggers/ActionsAndTriggersRoot.svelte"
  import AccessLevels from "components/accessLevels/AccessLevelsRoot.svelte"
  import ComingSoon from "components/common/ComingSoon.svelte"
</script>

<div class="root">
  <div class="nav">
    <BackendNav />
  </div>
  <div class="content">
    <!-- {#if $backendUiStore.leftNavItem === 'DATABASE'}
      <Database />
    {:else if $backendUiStore.leftNavItem === 'ACTIONS'}
      <ActionsAndTriggers />
    {:else if $backendUiStore.leftNavItem === 'ACCESS_LEVELS'}
      <AccessLevels />
    {/if} -->
    <slot />
  </div>
  <div class="nav">
    <!-- <SchemaManagementDrawer /> -->
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
