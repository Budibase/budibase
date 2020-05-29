<script>
  import { getContext } from "svelte"
  import { store, backendUiStore } from "builderStore"
  import * as api from "components/database/ModelDataTable/api"

  import BackendNav from "components/nav/BackendNav.svelte"
  import SchemaManagementDrawer from "components/nav/SchemaManagementDrawer.svelte"
</script>

<div class="root">
  <div class="nav">
    <BackendNav />
  </div>
  <div class="content">
    <slot />
  </div>
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
    margin: 20px 40px;
  }

  .nav {
    overflow: auto;
    flex: 0 1 auto;
    width: 300px;
    height: 100%;
  }

</style>
