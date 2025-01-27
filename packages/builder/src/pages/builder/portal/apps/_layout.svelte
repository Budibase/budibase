<script>
  import { notifications } from "@budibase/bbui"
  import {
    admin,
    appsStore,
    templates,
    licensing,
    groups,
    auth,
  } from "@/stores/portal"
  import { onMount } from "svelte"
  import { redirect } from "@roxi/routify"
  import { sdk } from "@budibase/shared-core"
  import PortalSideBar from "./_components/PortalSideBar.svelte"

  // Don't block loading if we've already hydrated state
  let loaded = !!$appsStore.apps?.length

  onMount(async () => {
    try {
      const promises = [licensing.init()]

      if (!$admin.offlineMode) {
        promises.push(templates.load())
      }

      promises.push(groups.init())

      // Always load latest
      await Promise.all(promises)

      if (!$admin.offlineMode && $templates?.length === 0) {
        notifications.error("There was a problem loading quick start templates")
      }

      // Go to new app page if no apps exists
      if (
        !$appsStore.apps.length &&
        sdk.users.hasBuilderPermissions($auth.user)
      ) {
        $redirect("./onboarding")
      }
    } catch (error) {
      notifications.error("Error loading apps and templates")
    }
    loaded = true
  })
</script>

{#if loaded}
  <div class="page">
    {#if $appsStore.apps.length > 0}
      <PortalSideBar />
    {/if}
    <slot />
  </div>
{/if}

<style>
  .page {
    flex: 1 1 auto;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: stretch;
  }
</style>
