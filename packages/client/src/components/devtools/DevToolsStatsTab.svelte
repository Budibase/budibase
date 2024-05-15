<script>
  import { Layout } from "@budibase/bbui"
  import { authStore, appStore, screenStore, componentStore } from "stores"
  import DevToolsStat from "./DevToolsStat.svelte"
</script>

<Layout noPadding gap="XS">
  <DevToolsStat label="App" value={$appStore.application?.name} />
  <DevToolsStat label="Tenant" value={$appStore.application?.tenantId} />
  <DevToolsStat label="Version" value={$appStore.application?.version} />
  {#if $appStore.clientLoadTime}
    <DevToolsStat
      label="Client load time"
      value={`${$appStore.clientLoadTime} ms`}
    />
  {/if}
  <DevToolsStat label="App screens" value={$screenStore.screens?.length || 0} />
  <DevToolsStat
    label="Active screen"
    value={$screenStore.activeScreen?.routing.route}
  />
  <DevToolsStat
    label="Components"
    value={$componentStore.mountedComponentCount}
  />
  <DevToolsStat label="User" value={$authStore?.email} />
  <DevToolsStat label="Role" value={$authStore?.roleId} />
</Layout>
