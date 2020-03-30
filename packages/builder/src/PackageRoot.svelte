<script>
  import IconButton from "./common/IconButton.svelte"
  import { store } from "./builderStore"
  import UserInterfaceRoot from "./userInterface/UserInterfaceRoot.svelte"
  import BackendRoot from "./BackendRoot.svelte"
  import { fade } from "svelte/transition"
  import { SettingsIcon, PreviewIcon } from "./common/Icons/"
  import { showAppNotification } from "./common/AppNotification.svelte"

  const TABS = {
    BACKEND: "backend",
    FRONTEND: "frontend",
  }

  let selectedTab = TABS.BACKEND
</script>

<div class="root">

  <div class="top-nav">
    <div class="topleftnav">
      <button class="home-logo">
        <img src="/_builder/assets/budibase-emblem-white.svg" />
      </button>
      <!-- <IconButton icon="home"
                      color="var(--slate)"
                      hoverColor="var(--secondary75)"/> -->
      <span
        class:active={selectedTab === TABS.BACKEND}
        class="topnavitem"
        on:click={() => (selectedTab = TABS.BACKEND)}>
        Backend
      </span>
      <span
        class:active={selectedTab === TABS.FRONTEND}
        class="topnavitem"
        on:click={() => (selectedTab = TABS.FRONTEND)}>
        Frontend
      </span>
    </div>

    <div class="toprightnav">
      <span
        class:active={selectedTab === TABS.FRONTEND}
        class="topnavitemright"
        on:click={() => selectedTab === TABS.FRONTEND}>
        <SettingsIcon />
      </span>
      <span
        class:active={selectedTab === TABS.FRONTEND}
        class="topnavitemright"
        on:click={() => selectedTab === TABS.FRONTEND}>
        <PreviewIcon />
      </span>
    </div>
  </div>

  <div class="content">
    {#if selectedTab === TABS.BACKEND}
      <div in:fade out:fade>
        <BackendRoot />
      </div>
    {:else}
      <div in:fade out:fade>
        <UserInterfaceRoot />
      </div>
    {/if}
  </div>

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
</style>
