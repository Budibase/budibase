<script>
  import { store, automationStore } from "builderStore"
  import { roles, flags } from "stores/backend"
  import {
    ActionMenu,
    MenuItem,
    Icon,
    Tabs,
    Tab,
    Heading,
    Modal,
    notifications,
  } from "@budibase/bbui"
  import RevertModal from "components/deploy/RevertModal.svelte"
  import VersionModal from "components/deploy/VersionModal.svelte"
  import DeployNavigation from "components/deploy/DeployNavigation.svelte"
  import { API } from "api"
  import { isActive, goto, layout, redirect } from "@roxi/routify"
  import { capitalise } from "helpers"
  import { onMount, onDestroy } from "svelte"
  import CommandPalette from "components/commandPalette/CommandPalette.svelte"

  export let application

  // let betaAccess = false
  let loaded = false
  let commandPaletteModal
  let commandPaletteVisible = false
  let canShowCommandPalette = false

  $: selected = capitalise(
    $layout.children.find(layout => $isActive(layout.path))?.title ?? "data"
  )

  const loadPackage = async () => {
    try {
      store.actions.reset()
      const pkg = await API.fetchAppPackage(application)
      await store.actions.initialise(pkg)
      await automationStore.actions.fetch()
      await roles.fetch()
      await flags.fetch()
      loaded = true
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
  const topItemNavigate = path => () => {
    const activeTopNav = $layout.children.find(c => $isActive(c.path))
    if (!activeTopNav) return
    store.update(state => {
      if (!state.previousTopNavPath) state.previousTopNavPath = {}
      state.previousTopNavPath[activeTopNav.path] = window.location.pathname
      $goto(state.previousTopNavPath[path] || path)
      return state
    })
  }

  // Event handlers for the command palette
  const handleKeyDown = e => {
    if (e.key === "Control") {
      canShowCommandPalette = true
    } else if (canShowCommandPalette) {
      canShowCommandPalette = false
    }
  }
  const handleKeyUp = e => {
    if (e.key === "Control" && canShowCommandPalette) {
      commandPaletteVisible
        ? commandPaletteModal.hide()
        : commandPaletteModal.show()
    }
  }

  onMount(async () => {
    try {
      await loadPackage()
      await API.syncApp(application)
      // check if user has beta access
      // const betaResponse = await API.checkBetaAccess($auth?.user?.email)
      // betaAccess = betaResponse.access
    } catch (error) {
      notifications.error("Failed to sync with production database")
    }
    loaded = true
  })

  onDestroy(() => {
    store.update(state => {
      state.appId = null
      return state
    })
  })
</script>

{#if loaded}
  <div class="root">
    <div class="top-nav">
      <div class="topleftnav">
        <ActionMenu>
          <div slot="control">
            <Icon size="M" hoverable name="ShowMenu" />
          </div>
          <MenuItem on:click={() => $goto("../../portal/apps")}>
            Exit to portal
          </MenuItem>
          <MenuItem
            on:click={() => $goto(`../../portal/overview/${application}`)}
          >
            Overview
          </MenuItem>
          <MenuItem
            on:click={() =>
              $goto(`../../portal/overview/${application}?tab=Access`)}
          >
            Access
          </MenuItem>
          <MenuItem
            on:click={() =>
              $goto(
                `../../portal/overview/${application}?tab=${encodeURIComponent(
                  "Automation History"
                )}`
              )}
          >
            Automation history
          </MenuItem>
          <MenuItem
            on:click={() =>
              $goto(`../../portal/overview/${application}?tab=Backups`)}
          >
            Backups
          </MenuItem>

          <MenuItem
            on:click={() =>
              $goto(`../../portal/overview/${application}?tab=Settings`)}
          >
            Settings
          </MenuItem>
        </ActionMenu>
        <Heading size="XS">{$store.name || "App"}</Heading>
      </div>
      <div class="topcenternav">
        <Tabs {selected} size="M">
          {#each $layout.children as { path, title }}
            <Tab
              quiet
              selected={$isActive(path)}
              on:click={topItemNavigate(path)}
              title={capitalise(title)}
            />
          {/each}
        </Tabs>
      </div>
      <div class="toprightnav">
        <div class="version">
          <VersionModal />
        </div>
        <RevertModal />
        <DeployNavigation {application} />
      </div>
    </div>
    <slot />
  </div>
{/if}

<svelte:window on:keydown={handleKeyDown} on:keyup={handleKeyUp} />
<Modal
  bind:this={commandPaletteModal}
  on:hide={() => (commandPaletteVisible = false)}
  on:show={() => (commandPaletteVisible = true)}
>
  <CommandPalette />
</Modal>

<style>
  .root {
    min-height: 100%;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
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
  }

  .topleftnav {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: var(--spacing-xl);
  }
  .topleftnav :global(.spectrum-Heading) {
    flex: 1 1 auto;
    width: 0;
    font-weight: 600;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .topcenternav {
    display: flex;
    position: relative;
    margin-bottom: -2px;
  }
  .topcenternav :global(.spectrum-Tabs-itemLabel) {
    font-weight: 600;
  }

  .toprightnav {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    gap: var(--spacing-xl);
  }

  .version {
    margin-right: var(--spacing-s);
  }
</style>
