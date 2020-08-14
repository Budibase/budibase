<script>
  import { getContext } from "svelte"
  import { store, backendUiStore } from "builderStore"
  import * as api from "components/database/ModelDataTable/api"

  import ModelNavigator from "components/nav/ModelNavigator/ModelNavigator.svelte"
</script>

<div class="root">
  <div class="nav">
    <ModelNavigator />
  </div>
  <div class="content">
    <slot />
  </div>
</div>

<style>
  .root {
    height: 100%;
    display: grid;
    grid-template-columns: 300px minmax(0, 1fr);
    background: var(--grey-1);
    line-height: 1;
  }

  .content {
    flex: 1 1 auto;
    margin: 20px 40px;
  }

  .nav {
    flex: 0 1 auto;
    width: 300px;
    height: 100%;
  }
</style>
