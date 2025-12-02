<script>
  import {
    initialise,
    reset,
    builderStore,
    previewStore,
    deploymentStore,
    appStore,
  } from "@/stores/builder"
  import { appsStore, admin } from "@/stores/portal"
  import { Heading, Layout, Body } from "@budibase/bbui"
  import { API } from "@/api"
  import BuilderSidePanel from "./_components/BuilderSidePanel.svelte"
  import PreviewOverlay from "./_components/PreviewOverlay.svelte"
  import SideNav from "./_components/SideNav/SideNav.svelte"

  export let application

  let promise = getPackage(application)
  let sideNav = null

  async function getPackage(appId) {
    try {
      if ($admin.maintenance.length) {
        return
      }
      if ($builderStore.created) {
        builderStore.appCreated(false)
        await appsStore.load()
      } else {
        reset()
        appStore.update(state => ({ ...state, appId }))
        const pkg = await API.fetchAppPackage(appId)

        await initialise(pkg)
      }
      await deploymentStore.load()
    } catch (error) {
      console.error(`Error initialising app: ${error?.message}`)
      sideNav.show()

      throw error
    }
  }
</script>

{#if $builderStore.builderSidePanel}
  <BuilderSidePanel />
{/if}

<div class="root" class:blur={$previewStore.showPreview}>
  <SideNav bind:this={sideNav} />
  {#await promise}
    <div class="loading"></div>
  {:then _}
    <div class="body">
      <slot />
    </div>
  {:catch error}
    <div class="body">
      <div class="init page-error">
        <Layout gap={"S"} alignContent={"center"} justifyItems={"center"}>
          <Heading size={"L"}>Oops...</Heading>
          <Body size={"S"}>There was a problem initialising the workspace</Body>
          <div class="error-message">
            {error?.message || "Something went wrong."}
          </div>
        </Layout>
      </div>
    </div>
  {/await}
</div>

{#if $previewStore.showPreview}
  <PreviewOverlay />
{/if}

<style>
  .init.page-error,
  .init.page-error :global(.container) {
    height: 100%;
  }
  .error-message {
    padding: var(--spacing-m);
    border-radius: 4px;
    background-color: var(--spectrum-global-color-gray-50);
    font-family: monospace;
    font-size: 12px;
  }
  .loading {
    min-height: 100%;
    height: 100%;
    width: 100%;
    background: var(--background);
  }
  .root {
    flex: 1;
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
