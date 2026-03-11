<script lang="ts">
  import {
    initialise,
    reset,
    builderStore,
    previewStore,
    deploymentStore,
    appStore,
  } from "@/stores/builder"
  import { appsStore, admin, aiConfigsStore } from "@/stores/portal"
  import { bb } from "@/stores/bb"
  import { Heading, Layout, Body } from "@budibase/bbui"
  import { API } from "@/api"
  import InviteUsersModal from "./_components/InviteUsersModal.svelte"
  import PreviewOverlay from "./_components/PreviewOverlay.svelte"
  import SideNav from "./_components/SideNav/SideNav.svelte"
  import { onMount } from "svelte"

  export let application: string

  let promise = getPackage(application)
  let sideNav: SideNav
  let showInviteUsersModal = false
  $: if ($bb.settings.open && showInviteUsersModal) {
    showInviteUsersModal = false
  }

  async function getPackage(appId: string) {
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
    } catch (error: any) {
      console.error(`Error initialising app: ${error?.message}`)
      sideNav.show()

      throw error
    }
  }

  onMount(() => {
    aiConfigsStore.init()
  })
</script>

{#if showInviteUsersModal}
  <InviteUsersModal onHide={() => (showInviteUsersModal = false)} />
{/if}

<div class="root" class:blur={$previewStore.showPreview}>
  <SideNav
    bind:this={sideNav}
    onInviteUser={() => (showInviteUsersModal = true)}
  />
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
    min-height: 0;
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
    min-height: 0;
    width: 0;
    z-index: 1;
    display: flex;
    flex-direction: column;
  }
</style>
