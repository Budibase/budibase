<script>
  import { notifications } from "@budibase/bbui"
  import {
    admin,
    appsStore,
    templates,
    licensing,
    groups,
    auth,
    featureFlags,
  } from "@/stores/portal"
  import { onMount } from "svelte"
  import { redirect } from "@roxi/routify"
  import { sdk } from "@budibase/shared-core"
  import HeroBanner from "@/components/common/HeroBanner.svelte"

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
    {#if $featureFlags.WORKSPACE_APPS}
      <HeroBanner
        title="Workspaces are live"
        linkTitle="Learn about workspaces"
        linkHref="https://budibase.com/blog/updates/workspaces/"
        color="var(--spectrum-global-color-gray-100)"
        image="https://res.cloudinary.com/daog6scxm/image/upload/w_1200,h_800/v1628152378/1.%20Illustrations/Scene_4_web_version_izudxc.avif"
      >
        Previously, Budibase centered everything around building a single app.
        With Workspaces, that changes. Now, you can group multiple apps,
        automations, and data sources together within a single workspace.
        Existing apps now have their own workspace.
      </HeroBanner>
    {/if}
    <slot />
  </div>
{/if}

<style>
  .page {
    margin: 20px 0;
  }
</style>
