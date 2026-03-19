<script lang="ts">
  import { goto as gotoStore } from "@roxi/routify"
  import { Body, notifications, Layout, Button } from "@budibase/bbui"
  import { API } from "@/api"
  import { buildBuilderWorkspaceRoute } from "@/helpers/routes"
  import { onMount } from "svelte"
  import Spinner from "@/components/common/Spinner.svelte"
  import BBLogo from "assets/BBLogo.svelte"
  import { appsStore, auth } from "@/stores/portal"
  import { sdk } from "@budibase/shared-core"

  $: goto = $gotoStore

  let loading = false
  let onboardingFailed = false
  let onboardingForbidden = false

  const goToApps = () => {
    goto("../apps")
  }

  const createDefaultWorkspace = async () => {
    if (loading) {
      return
    }
    loading = true
    try {
      const data = new FormData()
      data.append("isOnboarding", "true")

      // Build the default workspace
      const createdWorkspace = await API.createApp(data)

      if (!sdk.users.isBuilder($auth.user, createdWorkspace?.appId)) {
        await auth.getSelf()
      }

      // Ensure the apps are reloaded.
      await appsStore.load()

      if (!sdk.users.isBuilder($auth.user, createdWorkspace?.appId)) {
        goToApps()
        return
      }

      const targetRoute = buildBuilderWorkspaceRoute({
        applicationId: createdWorkspace.instance._id,
        segments: ["home"],
      })

      notifications.success(`Workspace created successfully`)
      goto(targetRoute)
    } catch (e: any) {
      loading = false
      onboardingFailed = true
      onboardingForbidden = e?.status === 403

      if (onboardingForbidden) {
        notifications.error("You don't have permission to create workspaces")
      } else {
        notifications.error(
          e.message || "There was a problem creating your workspace"
        )
      }
    }
  }

  onMount(() => {
    createDefaultWorkspace()
  })
</script>

<div class="content">
  <Layout alignContent="center" justifyItems="center">
    <div class="budibaseLogo">
      <BBLogo size={48} color={"var(--spectrum-global-color-gray-900)"} />
    </div>
    {#if loading}
      <Body size="M">Setting up your workspace...</Body>
      <Spinner size="10" />
    {:else if onboardingFailed}
      <Body size="M">
        {onboardingForbidden
          ? "You don't have permission to create a workspace."
          : "There was a problem."}
      </Body>
      {#if onboardingForbidden}
        <Button secondary on:click={goToApps}>Go to apps</Button>
      {:else}
        <Button secondary on:click={createDefaultWorkspace}>Try again</Button>
      {/if}
    {/if}
  </Layout>
</div>

<style>
  .content {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 64px;
  }
</style>
