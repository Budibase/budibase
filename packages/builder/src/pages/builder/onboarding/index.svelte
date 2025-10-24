<script lang="ts">
  import { goto } from "@roxi/routify"
  import { Body, notifications, Layout, Button } from "@budibase/bbui"
  import { API } from "@/api"
  import {
    buildBuilderWorkspaceDesignRoute,
    buildBuilderWorkspaceRoute,
  } from "@/helpers/routes"
  import { onMount } from "svelte"
  import Spinner from "@/components/common/Spinner.svelte"
  import BBLogo from "assets/BBLogo.svelte"
  import { appsStore } from "@/stores/portal"

  let loading = false
  let onboardingFailed = false

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

      // Ensure the apps are reloaded.
      await appsStore.load()

      const pkg = await API.fetchAppPackage(createdWorkspace.instance._id)
      const homeScreen = pkg.screens.find(screen => screen.routing?.homeScreen)

      // Send the user directly to the home screen
      const targetRoute =
        homeScreen?.workspaceAppId && homeScreen?._id
          ? buildBuilderWorkspaceDesignRoute({
              applicationId: createdWorkspace.instance._id,
              workspaceAppId: homeScreen.workspaceAppId,
              screenId: homeScreen._id,
            })
          : buildBuilderWorkspaceRoute({
              applicationId: createdWorkspace.instance._id,
            })

      notifications.success(`Workspace created successfully`)
      $goto(targetRoute)
    } catch (e: any) {
      loading = false
      onboardingFailed = true
      notifications.error(
        e.message || "There was a problem creating your workspace"
      )
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
      <Body size="M">There was a problem.</Body>
      <Button secondary on:click={createDefaultWorkspace}>Try again</Button>
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
