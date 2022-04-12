<script>
  import { store, automationStore } from "builderStore"
  import { roles, flags } from "stores/backend"
  import { Icon, Tabs, Tab, notifications, Heading } from "@budibase/bbui"
  import DeployModal from "components/deploy/DeployModal.svelte"
  import RevertModal from "components/deploy/RevertModal.svelte"
  import { API } from "api"
  import { apps } from "stores/portal"
  import { isActive, goto, layout, redirect } from "@roxi/routify"
  import { capitalise } from "helpers"
  import { onMount, onDestroy } from "svelte"

  export let application

  // Get Package and set store
  let promise = getPackage()

  // Sync once when you load the app
  let hasSynced = false

  $: selected = capitalise(
    $layout.children.find(layout => $isActive(layout.path))?.title ?? "data"
  )
  $: appInfo = $apps?.find(app => app.devId === application)
  $: published = appInfo?.status === "published"

  const viewPreviewApp = () => {
    window.open(`/${application}`)
  }

  const viewPublishedApp = () => {
    window.open(`/app${appInfo?.url}`)
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

  onMount(async () => {
    if (!hasSynced && application) {
      try {
        await API.syncApp(application)
      } catch (error) {
        notifications.error("Failed to sync with production database")
      }
      hasSynced = true
    }
    if (!$apps?.length) {
      apps.load()
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
    <div class="top-nav">
      <div class="topleftnav">
        <Icon
          size="M"
          name="ArrowLeft"
          hoverable
          on:click={() => $goto("../")}
        />
        <Heading size="S">{$store.name || "App"}</Heading>
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
        <RevertModal />
        <Icon
          name="Visibility"
          hoverable
          on:click={viewPreviewApp}
          tooltip="View app preview"
        />
        <Icon
          name={published ? "Globe" : "GlobeStrike"}
          hoverable
          disabled={!published}
          on:click={viewPublishedApp}
          tooltip={published
            ? "View published app"
            : "Your app is not published"}
        />
        <DeployModal />
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
    flex: 0 0 60px;
    background: var(--background);
    padding: 0 var(--spacing-xl);
    display: flex;
    flex-direction: row;
    box-sizing: border-box;
    justify-content: space-between;
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
    font-weight: 600;
  }

  .topcenternav {
    display: flex;
    position: relative;
    margin-bottom: -2px;
  }
  .topcenternav :global(.spectrum-Tabs-itemLabel) {
    font-weight: bold !important;
  }

  .toprightnav {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    gap: var(--spacing-xl);
  }
</style>
