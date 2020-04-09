<script>
  import { store } from "builderStore"

  import { fade } from "svelte/transition"
  import { isActive, goto, url, layout } from "@sveltech/routify"

  import { SettingsIcon, PreviewIcon } from "components/common/Icons/"
  import IconButton from "components/common/IconButton.svelte"

  // Get Package and set store
  export let application

  let promise = getPackage()

  async function getPackage() {
    const res = await fetch(`/_builder/api/${application}/appPackage`)
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
          src="/_builder/assets/budibase-emblem-white.svg"
          alt="budibase icon" />
      </button>

      <!-- List is an array of subfolders in the application folder. -->
      {#each $layout.children as { path, prettyName, children, meta }}
        <span
          class:active={$isActive(path)}
          class="topnavitem"
          on:click={() => $goto($url(path))}>
          {prettyName}
        </span>
      {/each}
      <!-- <IconButton icon="home"
                      color="var(--slate)"
                      hoverColor="var(--secondary75)"/> -->
    </div>
    <div class="toprightnav">
      <span
        class:active={$isActive(`${component.parent.path}/settings`)}
        class="topnavitemright"
        on:click={() => $goto(`${component.parent.path}/settings`)}>
        <SettingsIcon />
      </span>
      <span
        class:active={false}
        class="topnavitemright"
        on:click={() => console.log}>
        <PreviewIcon />
      </span>
    </div>
  </div>

  {#await promise}
    <!-- This should probably be some kind of loading state? -->
    <div />
  {:then}
    <slot />
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
    height: 48px;
    background: #0d203b;
    padding: 0px 20px 0 20px;
    display: flex;
    box-sizing: border-box;
    justify-content: space-between;
    align-items: center;
  }

  .content {
    flex: 1 1 auto;
    width: 100%;
    height: 100px;
    overflow: hidden;
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
    color: rgb(255, 255, 255, 0.6);
    margin: 0px 10px;
    padding-top: 4px;
    font-weight: 500;
    font-size: 1rem;
    height: 100%;
    align-items: center;
    box-sizing: border-box;
  }

  .topnavitem:hover {
    color: rgb(255, 255, 255, 0.8);
    font-weight: 500;
  }

  .active {
    color: white;
    font-weight: 600;
  }

  .topnavitemright {
    cursor: pointer;
    color: rgb(255, 255, 255, 0.6);
    margin: 0px 5px;
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
    color: rgb(255, 255, 255, 0.8);
    font-weight: 500;
  }

  .home-logo {
    border-style: none;
    background-color: rgba(0, 0, 0, 0);
    cursor: pointer;
    outline: none;
    height: 40px;
    padding: 8px 10px 8px 0;
  }

  .home-logo:hover {
    color: var(--hovercolor);
  }

  .home-logo:active {
    outline: none;
  }

  .home-logo img {
    height: 100%;
  }
  span:first-letter {
    text-transform: capitalize;
  }
</style>
