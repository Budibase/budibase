<script>
  import { store, automationStore } from "builderStore"
  import { roles } from "stores/backend"
  import { Icon, ActionGroup, Tabs, Tab, notifications } from "@budibase/bbui"
  import DeployModal from "components/deploy/DeployModal.svelte"
  import RevertModal from "components/deploy/RevertModal.svelte"
  import VersionModal from "components/deploy/VersionModal.svelte"
  import NPSFeedbackForm from "components/feedback/NPSFeedbackForm.svelte"
  import { get, post } from "builderStore/api"
  import { auth, admin } from "stores/portal"
  import { isActive, goto, layout, redirect } from "@roxi/routify"
  import Logo from "assets/bb-emblem.svg"
  import { capitalise } from "helpers"
  import UpgradeModal from "../../../../components/upgrade/UpgradeModal.svelte"
  import { onMount } from "svelte"

  // Get Package and set store
  export let application
  let promise = getPackage()
  // sync once when you load the app
  let hasSynced = false
  $: selected = capitalise(
    $layout.children.find(layout => $isActive(layout.path))?.title ?? "data"
  )

  let userShouldPostFeedback = false

  function previewApp() {
    if (!$auth?.user?.flags?.feedbackSubmitted) {
      userShouldPostFeedback = true
    }
    window.open(`/${application}`)
  }

  async function getPackage() {
    const res = await get(`/api/applications/${application}/appPackage`)
    const pkg = await res.json()

    if (res.ok) {
      try {
        await store.actions.initialise(pkg)
        // edge case, lock wasn't known to client when it re-directed, or user went directly
      } catch (err) {
        if (!err.ok && err.reason === "locked") {
          $redirect("../../")
        } else {
          throw err
        }
      }
      await automationStore.actions.fetch()
      await roles.fetch()
      return pkg
    } else {
      throw new Error(pkg)
    }
  }

  // handles navigation between frontend, backend, automation.
  // this remembers your last place on each of the sections
  // e.g. if one of your screens is selected on front end, then
  // you browse to backend, when you click frontend, you will be
  // brought back to the same screen
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
      const res = await post(`/api/applications/${application}/sync`)
      if (res.status !== 200) {
        notifications.error("Failed to sync with production database")
      }
      hasSynced = true
    }
  })
</script>

{#await promise}
  <!-- This should probably be some kind of loading state? -->
  <div class="loading" />
{:then _}
  <div class="root">
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
        <DeployModal />
      </div>
    </div>
    <slot />
  </div>
{:catch error}
  <p>Something went wrong: {error.message}</p>
{/await}

{#if userShouldPostFeedback}
  <NPSFeedbackForm on:complete={() => (userShouldPostFeedback = false)} />
{/if}

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
