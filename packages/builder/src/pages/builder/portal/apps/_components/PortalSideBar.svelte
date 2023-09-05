<script>
  import { Icon } from "@budibase/bbui"
  import PortalSideNavItem from "./PortalSideNavItem.svelte"
  import { apps } from "stores/portal"
  import { params, goto } from "@roxi/routify"

  let searchString

  $: filteredApps = $apps.filter(app => {
    return (
      !searchString ||
      app.name.toLowerCase().includes(searchString.toLowerCase())
    )
  })
</script>

<div class="side-bar">
  <div class="side-bar-controls">
    <div class="search">
      <input bind:value={searchString} placeholder="Search" />
      <Icon name="Search" size="S" />
    </div>
    <div class="add-app" on:click={() => $goto("./create")}>
      <Icon name="Add" />
    </div>
  </div>
  <div class="side-bar-nav">
    <PortalSideNavItem
      icon="WebPages"
      text="All apps"
      url="./"
      selected={!$params.appId}
    />
    {#each filteredApps as app}
      <PortalSideNavItem
        icon={app.icon?.name || "Apps"}
        iconColor={app.icon?.color}
        text={app.name}
        url={`./${app.appId}`}
        selected={$params.appId === app.appId}
      />
    {/each}
  </div>
</div>

<style>
  .side-bar {
    --spacing: 10px;
    --radius: 8px;

    flex: 0 0 300px;
    padding: var(--spacing);
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: var(--spacing);
  }
  .side-bar-controls {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: stretch;
    gap: var(--spacing);
  }
  .search {
    flex: 1 1 auto;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    position: relative;
  }
  input {
    outline: none;
    max-width: none;
    flex: 1 1 auto;
    padding: 0 38px 0 var(--spacing);
    color: var(--spectrum-global-color-gray-800);
    font-size: 14px;
    border: 1px solid transparent;
    transition: border 130ms ease-out;
    font-family: var(--font-sans);
  }
  input::placeholder {
    color: var(--spectrum-global-color-gray-700);
    transition: color 130ms ease-out;
  }
  input:hover {
    border: 1px solid var(--spectrum-global-color-gray-300);
  }
  input:hover::placeholder {
    color: var(--spectrum-global-color-gray-800);
  }
  input:focus {
    border: 1px solid var(--spectrum-global-color-blue-400);
  }

  .search :global(.spectrum-Icon) {
    position: absolute;
    right: 10px;
  }
  .add-app {
    flex: 0 0 32px;
    display: grid;
    place-items: center;
    transition: background 130ms ease-out;
  }
  .add-app:hover {
    cursor: pointer;
    background: var(--spectrum-global-color-gray-200);
  }
  .search input,
  .add-app {
    height: 32px;
  }
  .search input,
  .add-app,
  .side-bar-nav {
    background: var(--spectrum-global-color-gray-100);
    border-radius: var(--radius);
  }
  .side-bar-nav {
    flex: 1 1 auto;
    padding: var(--spacing);
    display: flex;
    flex-direction: column;
    justify-items: flex-start;
    align-items: stretch;
    gap: 6px;
    overflow: auto;
    overflow-x: hidden;
  }
</style>
