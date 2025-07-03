<script>
  import {
    initialise,
    reset,
    appStore,
    builderStore,
    previewStore,
    userStore,
    deploymentStore,
  } from "@/stores/builder"
  import { appsStore, featureFlags } from "@/stores/portal"
  import {
    Icon,
    Tabs,
    Tab,
    Body,
    notifications,
    TooltipPosition,
  } from "@budibase/bbui"
  import AppActions from "@/components/deploy/AppActions.svelte"
  import { API } from "@/api"
  import { isActive, url, goto, layout, redirect } from "@roxi/routify"
  import { capitalise } from "@/helpers"
  import { onMount, onDestroy } from "svelte"
  import BuilderSidePanel from "../_components/BuilderSidePanel.svelte"
  import { UserAvatars } from "@budibase/frontend-core"
  import PreviewOverlay from "../_components/PreviewOverlay.svelte"
  import EnterpriseBasicTrialModal from "@/components/portal/onboarding/EnterpriseBasicTrialModal.svelte"
  import UpdateAppTopNav from "@/components/common/UpdateAppTopNav.svelte"

  export let application

  let promise = getPackage()
  let hasSynced = false
  let loaded = false

  $: selected = capitalise(
    $layout.children.find(layout => $isActive(layout.path))?.title ?? "data"
  )

  async function getPackage() {
    try {
      reset()

      const pkg = await API.fetchAppPackage(application)
      await initialise(pkg)

      await appsStore.load()
      await deploymentStore.load()

      loaded = true
      return pkg
    } catch (error) {
      notifications.error(`Error initialising app: ${error?.message}`)
      $redirect("../../")
    }
  }
  // Handles navigation between frontend, backend, automation.
  // This remembers your last place on each of the sections
  // e.g. if one of your screens is selected on front end, then
  // you browse to backend, when you click frontend, you will be
  // brought back to the same screen.
  const topItemNavigate = path => {
    const activeTopNav = $layout.children.find(c => $isActive(c.path))
    if (activeTopNav) {
      builderStore.setPreviousTopNavPath(
        activeTopNav.path,
        window.location.pathname
      )
    }
    $goto($builderStore.previousTopNavPath[path] || path)
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
  <div class="top-nav">
    {#if $appStore.initialised}
      <div class="topleftnav">
        <a href={$url("../../portal/apps")} class="linkWrapper back-to-apps">
          <Icon size="S" hoverable name="arrow-left" />
        </a>
        <Tabs {selected} size="M">
          {#each $layout.children as { path, title }}
            {#if title === "agent" && !$featureFlags.AI_AGENTS}
              <!-- skip -->
            {:else}
              <Tab
                link
                href={$url(path)}
                quiet
                selected={$isActive(path)}
                on:click={() => topItemNavigate(path)}
                title={capitalise(title)}
                id={`builder-${title}-tab`}
              />
            {/if}
          {/each}
        </Tabs>
      </div>
      <div class="topcenternav">
        <div class="app-name">
          <UpdateAppTopNav {application}>
            <Body
              size="S"
              weight="600"
              color="var(--spectrum-global-color-gray-900)"
            >
              {$appStore.name}</Body
            >
          </UpdateAppTopNav>
        </div>
      </div>
      <div class="toprightnav">
        <span>
          <UserAvatars
            users={$userStore}
            order="rtl"
            tooltipPosition={TooltipPosition.Bottom}
          />
        </span>
        <AppActions {application} {loaded} />
      </div>
    {/if}
  </div>
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
  .linkWrapper {
    text-decoration: none;
    color: inherit;
  }

  .back-to-apps {
    display: contents;
  }
  .back-to-apps :global(.icon) {
    margin-left: 12px;
    margin-right: 12px;
  }
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
    flex-direction: column;
    transition: filter 260ms ease-out;
  }
  .root.blur {
    filter: blur(8px);
  }

  .top-nav {
    flex: 0 0 60px;
    background: var(--background);
    padding: 0 var(--spacing-xl);
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    flex-direction: row;
    box-sizing: border-box;
    align-items: stretch;
    border-bottom: var(--border-light);
    z-index: 2;
  }
  .top-nav > * {
    height: 100%;
  }

  .topcenternav {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: var(--spacing-xl);
  }

  .topcenternav :global(.spectrum-Heading) {
    flex: 1 1 auto;
    font-weight: 600;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .topleftnav {
    display: flex;
    position: relative;
    margin-bottom: -2px;
    overflow: hidden;
    height: calc(100% + 2px);
  }

  .topleftnav :global(.spectrum-Tabs-itemLabel) {
    font-weight: 600;
  }

  .toprightnav {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    margin-right: calc(-1 * var(--spacing-xl));
  }

  .toprightnav :global(.avatars) {
    margin-right: var(--spacing-l);
  }

  .body {
    flex: 1 1 auto;
    z-index: 1;
    display: flex;
    flex-direction: column;
  }
</style>
