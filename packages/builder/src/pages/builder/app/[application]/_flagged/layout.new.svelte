<script>
  import {
    initialise,
    reset,
    builderStore,
    previewStore,
    deploymentStore,
  } from "@/stores/builder"
  import { appsStore } from "@/stores/portal"
  import { notifications } from "@budibase/bbui"
  import { API } from "@/api"
  import { redirect } from "@roxi/routify"
  import { onMount, onDestroy } from "svelte"
  import BuilderSidePanel from "../_components/BuilderSidePanel.svelte"
  import PreviewOverlay from "../_components/PreviewOverlay.svelte"
  import EnterpriseBasicTrialModal from "@/components/portal/onboarding/EnterpriseBasicTrialModal.svelte"
  import SideNav from "../_components/SideNav/SideNav.svelte"

  export let application

  let promise = getPackage()
  let hasSynced = false

  async function getPackage() {
    try {
      reset()
      const pkg = await API.fetchAppPackage(application)
      await initialise(pkg)
      await appsStore.load()
      await deploymentStore.load()
      return pkg
    } catch (error) {
      notifications.error(`Error initialising app: ${error?.message}`)
      $redirect("../../")
    }
  }

  onMount(async () => {
    if (!hasSynced && application) {
      try {
        await API.syncApp(application)
      } catch (error) {
        notifications.error("Failed to sync with production database")
      }
      hasSynced = true
    }
  })

  onDestroy(() => {
    // Run async on a slight delay to let other cleanup logic run without
    // being confused by the store wiping
    setTimeout(reset, 10)
  })
</script>

{#if $builderStore.builderSidePanel}
  <BuilderSidePanel />
{/if}

<div class="root" class:blur={$previewStore.showPreview}>
  <SideNav />
  {#await promise}
    <!-- This should probably be some kind of loading state? -->
    <div class="loading" />
  {:then _}
    <div class="body">
      <slot />
    </div>
  {:catch error}
    <p>Something went wrong: {error.message}</p>
  {/await}
</div>

{#if $previewStore.showPreview}
  <PreviewOverlay />
{/if}

<EnterpriseBasicTrialModal />

<style>
  .loading {
    min-height: 100%;
    height: 100%;
    width: 100%;
    background: var(--background);
  }
  .root {
    min-height: 100%;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: row;
    transition: filter 260ms ease-out;
    align-items: stretch;
    position: relative;
  }
  .root.blur {
    filter: blur(8px);
  }
  .body {
    flex: 1 1 auto;
    width: 0;
    z-index: 1;
    display: flex;
    flex-direction: column;
  }
</style>
