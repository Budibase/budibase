<script lang="ts">
  import { onMount } from "svelte"
  import { goto } from "@roxi/routify"
  import { Button, Body, notifications } from "@budibase/bbui"
  import Spinner from "@/components/common/Spinner.svelte"
  import { API } from "@/api"
  import { auth, admin } from "@/stores/portal"
  import { initialise } from "@/stores/builder"
  import {
    buildBuilderWorkspaceDesignRoute,
    buildBuilderWorkspaceRoute,
  } from "@/helpers/routes"

  const DEFAULT_ONBOARDING_NAME = "My first app"
  const DEFAULT_ONBOARDING_URL = "my-first-app"

  let loading = true
  let error: string | null = null

  const createOnboardingApp = async () => {
    loading = true
    error = null

    try {
      const data = new FormData()
      data.append("name", DEFAULT_ONBOARDING_NAME)
      data.append("url", DEFAULT_ONBOARDING_URL)
      data.append("useTemplate", "false")
      data.append("isOnboarding", "true")

      const createdApp = await API.createApp(data)

      const pkg = await API.fetchAppPackage(createdApp.instance._id)

      await initialise(pkg)
      await admin.init()
      await auth.setInitInfo({})

      const homeScreen = pkg.screens.find(screen => screen.routing?.homeScreen)

      const targetRoute =
        homeScreen?.workspaceAppId && homeScreen?._id
          ? buildBuilderWorkspaceDesignRoute({
              applicationId: createdApp.instance._id,
              workspaceAppId: homeScreen.workspaceAppId,
              screenId: homeScreen._id,
            })
          : buildBuilderWorkspaceRoute({
              applicationId: createdApp.instance._id,
            })

      $goto(targetRoute)
    } catch (e: any) {
      loading = false
      const message = e?.message || "There was a problem creating your app"
      error = message
      notifications.error(message)
    }
  }

  onMount(() => {
    createOnboardingApp()
  })
</script>

<div class="container">
  {#if loading}
    <div class="content">
      <Spinner size="10" />
      <Body size="M">Setting up your workspace...</Body>
    </div>
  {:else}
    <div class="content">
      <Body size="M">{error}</Body>
      <Button size="L" cta on:click={createOnboardingApp}>Try again</Button>
    </div>
  {/if}
</div>

<style>
  .container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: var(--background);
  }

  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-xl);
    text-align: center;
  }
</style>
