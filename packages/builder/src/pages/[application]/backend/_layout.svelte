<script>
  import { getContext } from "svelte"
  import { store, backendUiStore } from "builderStore"
  import * as api from "components/database/ModelDataTable/api"

  import ModelNavigator from "components/nav/ModelNavigator/ModelNavigator.svelte"
  import { ModelSetupNav } from "components/nav/ModelSetupNav"
</script>

<div class="root">
  <div class="nav">
    <ModelNavigator />
  </div>
  <div class="content">
    <slot />
  </div>
  <div class="nav">
    <ModelSetupNav />
  </div>
</div>

<style>
  .root {
    height: 100%;
    display: flex;
    background: var(--grey-1);
  }

  .content {
    flex: 1 1 auto;
    margin: 20px 40px;
  }

  .nav {
    overflow: auto;
    flex: 0 1 auto;
    width: 300px;
    height: 100%;
  }
</style>
