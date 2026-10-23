<script lang="ts">
  import { sdk } from "@budibase/shared-core"
  import { get } from "svelte/store"
  import { goto, params } from "@roxi/routify"
  import {
    initialise,
    reset,
    builderStore,
    previewStore,
    deploymentStore,
    workspaceStore,
    componentStore,
    screenStore,
  } from "@/stores/builder"
  import { workspacesStore, admin, aiConfigsStore, auth } from "@/stores/portal"
  import { bb } from "@/stores/bb"
  import { Heading, Layout, Body, notifications } from "@budibase/bbui"
  import { API } from "@/api"
  import { getProjectSetupRequest } from "@/helpers/workspaceHomeNavigation"
  import ProjectSetupBackButton from "@/components/projects/ProjectSetupBackButton.svelte"
  import InviteUsersModal from "./_components/InviteUsersModal.svelte"
  import PreviewOverlay from "./_components/PreviewOverlay.svelte"
  import SideNav from "./_components/SideNav/SideNav.svelte"
  import { onMount } from "svelte"

  export let workspaceId: string

  let packageKey = `${workspaceId}:${$params.screenId || ""}`
  let packageInitialisation = Promise.resolve()
  let initialisedWorkspaceId: string | undefined
  const workspaceInitialisation = getPackage({
    appId: workspaceId,
    requestKey: packageKey,
    screenId: $params.screenId,
  })
  let sideNav: SideNav
  let showInviteUsersModal = false
  $: {
    const nextPackageKey = `${workspaceId}:${$params.screenId || ""}`
    if (nextPackageKey !== packageKey) {
      packageKey = nextPackageKey
      getPackage({
        appId: workspaceId,
        requestKey: packageKey,
        screenId: $params.screenId,
      }).catch(error => {
        notifications.error(
          error?.message || "There was a problem loading the screen"
        )
      })
    }
  }
  $: projectSetupReturn = getProjectSetupRequest({
    workspaceId,
    homeUrl: $params["?returnTo"],
  })
  $: canInviteUsers = sdk.users.isAdmin($auth.user)
  $: canManageConnections =
    $auth.user != null && sdk.users.canCreateApps($auth.user)
  $: if ($bb.settings.open && showInviteUsersModal) {
    showInviteUsersModal = false
  }
  $: if (!canInviteUsers && showInviteUsersModal) {
    showInviteUsersModal = false
  }

  async function getPackage({
    appId,
    requestKey,
    screenId,
  }: {
    appId: string
    requestKey: string
    screenId?: string
  }) {
    try {
      if ($admin.maintenance.length) {
        return
      }
      const isScreenLoaded =
        !!screenId &&
        initialisedWorkspaceId === appId &&
        get(screenStore).screens.some(
          screen => screen._id === screenId && screen._rev
        )
      if (isScreenLoaded) {
        return
      }
      previewStore.setUpdatingAppPackage(true)
      if ($builderStore.created) {
        builderStore.appCreated(false)
        await workspacesStore.load()
      } else {
        const isSameWorkspace = $workspaceStore.appId === appId
        const componentToPaste = isSameWorkspace
          ? $componentStore.componentToPaste
          : undefined
        if (!isSameWorkspace) {
          reset()
          initialisedWorkspaceId = undefined
        }
        componentStore.update(state => ({ ...state, componentToPaste }))
        workspaceStore.update(state => ({ ...state, appId }))
        const pkg = await API.fetchAppPackage(appId, screenId)
        if (requestKey !== packageKey) {
          return
        }

        const currentInitialisation = packageInitialisation.then(async () => {
          if (requestKey !== packageKey) {
            return
          }
          if (isSameWorkspace && initialisedWorkspaceId === appId) {
            screenStore.syncAppScreens(pkg, screenId)
          } else {
            await initialise(pkg, screenId)
            initialisedWorkspaceId = appId
          }
          if (requestKey === packageKey) {
            await deploymentStore.load()
          }
        })
        packageInitialisation = currentInitialisation.catch(() => {})
        await currentInitialisation
        return
      }
      await deploymentStore.load()
    } catch (error: any) {
      if (requestKey !== packageKey) {
        return
      }
      console.error(`Error initialising app: ${error?.message}`)
      sideNav.show()

      throw error
    } finally {
      if (requestKey === packageKey) {
        previewStore.setUpdatingAppPackage(false)
      }
    }
  }

  onMount(() => {
    aiConfigsStore.init()
  })
</script>

{#if canInviteUsers && showInviteUsersModal}
  <InviteUsersModal onHide={() => (showInviteUsersModal = false)} />
{/if}

<div class="root" class:blur={$previewStore.showPreview}>
  <SideNav
    bind:this={sideNav}
    {canInviteUsers}
    {canManageConnections}
    onInviteUser={() => {
      if (canInviteUsers) {
        showInviteUsersModal = true
      }
    }}
  />
  {#await workspaceInitialisation}
    <div class="loading"></div>
  {:then _}
    <div class="body">
      {#if projectSetupReturn}
        <ProjectSetupBackButton
          onReturn={() => {
            if (projectSetupReturn) {
              $goto(projectSetupReturn.url)
            }
          }}
        />
      {/if}
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
