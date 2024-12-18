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
  import { auth, appsStore } from "@/stores/portal"
  import {
    Icon,
    Tabs,
    Tab,
    Heading,
    Modal,
    notifications,
    TooltipPosition,
  } from "@budibase/bbui"
  import AppActions from "@/components/deploy/AppActions.svelte"
  import { API } from "@/api"
  import { isActive, url, goto, layout, redirect } from "@roxi/routify"
  import { capitalise } from "@/helpers"
  import { onMount, onDestroy } from "svelte"
  import VerificationPromptBanner from "@/components/common/VerificationPromptBanner.svelte"
  import CommandPalette from "@/components/commandPalette/CommandPalette.svelte"
  import TourWrap from "@/components/portal/onboarding/TourWrap.svelte"
  import TourPopover from "@/components/portal/onboarding/TourPopover.svelte"
  import BuilderSidePanel from "./_components/BuilderSidePanel.svelte"
  import { UserAvatars } from "@budibase/frontend-core"
  import { TOUR_KEYS } from "@/components/portal/onboarding/tours.js"
  import PreviewOverlay from "./_components/PreviewOverlay.svelte"
  import EnterpriseBasicTrialModal from "@/components/portal/onboarding/EnterpriseBasicTrialModal.svelte"
  import UpdateAppTopNav from "@/components/common/UpdateAppTopNav.svelte"

  export let application

  let promise = getPackage()
  let hasSynced = false
  let commandPaletteModal
  let loaded = false

  $: loaded && initTour()
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

  // Event handler for the command palette
  const handleKeyDown = e => {
    if (e.key === "k" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      commandPaletteModal.toggle()
    }
  }

  const initTour = async () => {
    // Check if onboarding is enabled.
    if (!$auth.user?.onboardedAt) {
      builderStore.startBuilderOnboarding()
    } else {
      // Feature tour date
      const release_date = new Date("2023-03-01T00:00:00.000Z")
      const onboarded = new Date($auth.user?.onboardedAt)
      if (onboarded < release_date) {
        builderStore.setTour(TOUR_KEYS.FEATURE_ONBOARDING)
      }
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

<TourPopover />

{#if $builderStore.builderSidePanel}
  <BuilderSidePanel />
{/if}

<div class="root" class:blur={$previewStore.showPreview}>
  <VerificationPromptBanner />
  <div class="top-nav">
    {#if $appStore.initialised}
      <div class="topleftnav">
        <a href={$url("../../portal/apps")} class="linkWrapper back-to-apps">
          <Icon size="S" hoverable name="BackAndroid" />
        </a>
        <Tabs {selected} size="M">
          {#each $layout.children as { path, title }}
            <TourWrap stepKeys={[`builder-${title}-section`]}>
              <Tab
                link
                href={$url(path)}
                quiet
                selected={$isActive(path)}
                on:click={() => topItemNavigate(path)}
                title={capitalise(title)}
                id={`builder-${title}-tab`}
              />
            </TourWrap>
          {/each}
        </Tabs>
      </div>
      <div class="topcenternav">
        <div class="app-name">
          <UpdateAppTopNav {application}>
            <Heading noPadding size="XS">{$appStore.name}</Heading>
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

<svelte:window on:keydown={handleKeyDown} />
<Modal bind:this={commandPaletteModal} zIndex={999999}>
  <CommandPalette />
</Modal>

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
