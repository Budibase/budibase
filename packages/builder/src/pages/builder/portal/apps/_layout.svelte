<script lang="ts">
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
    <slot />
  </div>
{/if}

<style>
  .page {
    margin: 20px 0;
  }
</style>
