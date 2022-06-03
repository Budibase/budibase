<script>
  import { store, automationStore } from "builderStore"
  import { roles, flags } from "stores/backend"
  import {
    Button,
    Icon,
    ActionGroup,
    Tabs,
    Tab,
    notifications,
    Banner,
  } from "@budibase/bbui"
  import RevertModal from "components/deploy/RevertModal.svelte"
  import VersionModal from "components/deploy/VersionModal.svelte"
  import DeployNavigation from "components/deploy/DeployNavigation.svelte"
  import { API } from "api"
  import { auth, admin } from "stores/portal"
  import { isActive, goto, layout, redirect } from "@roxi/routify"
  import Logo from "assets/bb-emblem.svg"
  import { capitalise } from "helpers"
  import UpgradeModal from "components/upgrade/UpgradeModal.svelte"
  import { onMount, onDestroy } from "svelte"

  export let application

  // Get Package and set store
  let promise = getPackage()

  // Sync once when you load the app
  let hasSynced = false
  $: selected = capitalise(
    $layout.children.find(layout => $isActive(layout.path))?.title ?? "data"
  )

  const previewApp = () => {
    window.open(`/${application}`)
  }

  async function getPackage() {
    try {
      const pkg = await API.fetchAppPackage(application)
      await store.actions.initialise(pkg)
      await automationStore.actions.fetch()
      await roles.fetch()
      await flags.fetch()
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

  async function newDesignUi() {
    await flags.toggleUiFeature("design_ui")
    window.location.reload()
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
    store.actions.reset()
  })
</script>

{#await promise}
  <!-- This should probably be some kind of loading state? -->
  <div class="loading" />
{:then _}
  <div class="root">
    <Banner>
      Wanna try the new UI?
      <Button on:click={newDesignUi}>Try the all new Budibase Design UI</Button>
    </Banner>
    <div class="top-nav">
      <div class="topleftnav">
        <button class="home-logo">
          <img
            src={Logo}
            alt="budibase icon"
            on:click={() => $goto(`../../portal/`)}
          />
        </button>

        <div class="tabs">
          <Tabs {selected}>
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

        <!-- This gets all indexable subroutes and sticks them in the top nav. -->
        <ActionGroup />
      </div>
      <div class="toprightnav">
        {#if $admin.cloud && $auth.user.account}
          <UpgradeModal />
        {/if}
        <VersionModal />
        <RevertModal />
        <Icon name="Play" hoverable on:click={previewApp} />
        <DeployNavigation {application} />
      </div>
    </div>
    <slot />
  </div>
{:catch error}
  <p>Something went wrong: {error.message}</p>
{/await}

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
    flex-direction: column;
  }

  .top-nav {
    flex: 0 0 auto;
    background: var(--background);
    padding: 0 var(--spacing-xl);
    display: flex;
    box-sizing: border-box;
    justify-content: space-between;
    align-items: center;
    border-bottom: var(--border-light);
  }

  .toprightnav {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    gap: var(--spacing-xl);
  }

  .topleftnav {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }

  .tabs {
    display: flex;
    position: relative;
    margin-bottom: -1px;
  }

  .home-logo {
    border-style: none;
    background-color: rgba(0, 0, 0, 0);
    cursor: pointer;
    outline: none;
    padding: 0 10px 0 0;
    align-items: center;
    height: 32px;
  }

  .home-logo:active {
    outline: none;
  }

  .home-logo img {
    height: 30px;
  }
</style>
