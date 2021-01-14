<script>
  import { store, automationStore, backendUiStore } from "builderStore"
  import { Button } from "@budibase/bbui"
  import SettingsLink from "components/settings/Link.svelte"
  import ThemeEditorDropdown from "components/settings/ThemeEditorDropdown.svelte"
  import FeedbackNavLink from "components/feedback/FeedbackNavLink.svelte"
  import { get } from "builderStore/api"
  import { isActive, goto, layout } from "@sveltech/routify"

  // Get Package and set store
  export let application

  let promise = getPackage()

  async function getPackage() {
    const res = await get(`/api/applications/${application}/appPackage`)
    const pkg = await res.json()

    if (res.ok) {
      backendUiStore.actions.reset()
      await store.actions.initialise(pkg)
      await automationStore.actions.fetch()
      await backendUiStore.actions.roles.fetch()
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
      state.previousTopNavPath[
        activeTopNav.path
      ] = window.location.pathname.replace("/_builder", "")
      $goto(state.previousTopNavPath[path] || path)
      return state
    })
  }
</script>

<div class="root">
  <div class="top-nav">
    <div class="topleftnav">
      <button class="home-logo">
        <img
          src="/_builder/assets/bb-logo.svg"
          alt="budibase icon"
          on:click={() => $goto(`/`)} />
      </button>

      <!-- This gets all indexable subroutes and sticks them in the top nav. -->
      {#each $layout.children as { path, title }}
        <span
          class:active={$isActive(path)}
          class="topnavitem"
          on:click={topItemNavigate(path)}>
          {title}
        </span>
      {/each}
    </div>
    <div class="toprightnav">
      <ThemeEditorDropdown />
      <FeedbackNavLink />
      <div class="topnavitemright">
        <a
          target="_blank"
          href="https://github.com/Budibase/budibase/discussions">
          <i class="ri-question-line" />
        </a>
      </div>
      <SettingsLink />
      <Button
        secondary
        on:click={() => {
          window.open(`/${application}`)
        }}>
        Preview
      </Button>
    </div>
  </div>
  <div class="beta">
    <Button
      secondary
      href="https://www.budibase.com/blog/budibase-public-beta/">
      Budibase is in Beta
    </Button>
  </div>

  {#await promise}
    <!-- This should probably be some kind of loading state? -->
    <div />
  {:then _}
    <slot />
  {:catch error}
    <p>Something went wrong: {error.message}</p>
  {/await}
</div>

<style>
  .root {
    min-height: 100%;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  a {
    text-transform: none;
    color: var(--grey-5);
  }

  .top-nav {
    flex: 0 0 auto;
    height: 60px;
    background: var(--background);
    padding: 0 20px;
    display: flex;
    box-sizing: border-box;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--grey-2);
  }

  .content > div {
    height: 100%;
    width: 100%;
  }

  .toprightnav {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
  }

  .topleftnav {
    display: flex;
    align-items: center;
  }

  .topnavitem {
    cursor: pointer;
    color: var(--grey-5);
    margin: 0 0 0 20px;
    font-weight: 500;
    font-size: var(--font-size-m);
    height: 100%;
    align-items: center;
    box-sizing: border-box;
  }

  .topnavitem:hover {
    color: var(--grey-7);
    font-weight: 500;
  }

  .active {
    color: var(--ink);
    font-weight: 500;
  }

  .topnavitemright a {
    cursor: pointer;
    color: var(--grey-7);
    margin: 0 12px 0 0;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    height: 24px;
    width: 24px;
  }

  .topnavitemright a:hover {
    color: var(--ink);
    font-weight: 500;
  }

  .home-logo {
    border-style: none;
    background-color: rgba(0, 0, 0, 0);
    cursor: pointer;
    outline: none;
    height: 40px;
    padding: 0px 10px 8px 0;
    align-items: center;
  }

  .home-logo:active {
    outline: none;
  }

  .home-logo img {
    height: 40px;
  }
  span:first-letter {
    text-transform: capitalize;
  }

  i {
    font-size: 18px;
    color: var(--grey-7);
  }
  i:hover {
    color: var(--ink);
  }

  .beta {
    position: absolute;
    bottom: var(--spacing-m);
    left: var(--spacing-m);
    z-index: 1;
  }
</style>
