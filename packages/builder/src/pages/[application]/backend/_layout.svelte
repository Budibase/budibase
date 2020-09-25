<script>
  import { getContext } from "svelte"
  import { store, backendUiStore } from "builderStore"
  import * as api from "components/backend/DataTable/api"
  import ModelNavigator from "components/backend/ModelNavigator/ModelNavigator.svelte"
</script>

<!-- routify:options index=1 -->
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
    height: calc(100vh - 60px);
    display: grid;
    grid-template-columns: 300px minmax(0, 1fr);
    background: var(--grey-1);
    line-height: 1;
  }
  .content {
    flex: 1 1 auto;
    padding: var(--spacing-xl) 40px;
    overflow-y: auto;
  }
  .nav {
    overflow-y: auto;
    background: var(--white);
    padding: var(--spacing-xl);
  }
</style>
