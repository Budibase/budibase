<script>
  import { store } from "builderStore"

  import { fade } from "svelte/transition"
  import { isActive, goto, layout } from "@sveltech/routify"

  import { SettingsIcon, PreviewIcon } from "components/common/Icons/"
  import IconButton from "components/common/IconButton.svelte"

  // Get Package and set store
  export let application

  let promise = getPackage()

  async function getPackage() {
    const res = await fetch(`/api/${application}/appPackage`)
    const pkg = await res.json()

    if (res.ok) {
      await store.setPackage(pkg)
      return pkg
    } else {
      throw new Error(pkg)
    }
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
          on:click={() => $goto(path)}>
          {title}
        </span>
      {/each}
      <!-- <IconButton icon="home"
                      color="var(--slate)"
                      hoverColor="var(--secondary75)"/> -->
    </div>
    <div class="toprightnav">
      <span
        class:active={$isActive(`/settings`)}
        class="topnavitemright"
        on:click={() => $goto(`/settings`)}>
        <SettingsIcon />
      </span>
      <span
        class:active={false}
        class="topnavitemright"
        on:click={() => (location = `/${application}`)}>
        <PreviewIcon />
      </span>
    </div>
  </div>

  {#await promise}
    <!-- This should probably be some kind of loading state? -->
    <div />
  {:then}
    <slot />
  {:catch error}
    <p>Something went wrong: {error.message}</p>
  {/await}

</div>

<style>
  .root {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  .top-nav {
    flex: 0 0 auto;
    height: 60px;
    background: #fff;
    padding: 0px 20px 0 20px;
    display: flex;
    box-sizing: border-box;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--grey);
  }

  .content > div {
    height: 100%;
    width: 100%;
  }

  .toprightnav {
    display: flex;
  }

  .topleftnav {
    display: flex;
    align-items: center;
  }

  .topnavitem {
    cursor: pointer;
    color: var(--ink-lighter);
    margin: 0px 00px 0px 20px;
    padding-top: 4px;
    font-weight: 500;
    font-size: 1rem;
    height: 100%;
    align-items: center;
    box-sizing: border-box;
  }

  .topnavitem:hover {
    color: var(--ink-light);
    font-weight: 500;
  }

  .active {
    color: var(--ink);
    font-weight: 500;
  }

  .topnavitemright {
    cursor: pointer;
    color: var(--ink-light);
    margin: 0px 20px 0px 0px;
    padding-top: 4px;
    font-weight: 500;
    font-size: 1rem;
    height: 100%;
    display: flex;
    flex: 1;
    align-items: center;
    box-sizing: border-box;
  }

  .topnavitemright:hover {
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

  .home-logo:hover {
    color: var(--hovercolor);
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
</style>
