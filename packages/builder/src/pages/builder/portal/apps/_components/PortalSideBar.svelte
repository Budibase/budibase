<script>
  import { Icon, Body } from "@budibase/bbui"
  import PortalSideNavItem from "./PortalSideNavItem.svelte"
  import { apps, sideBarCollapsed } from "stores/portal"
  import { params, goto } from "@roxi/routify"
  import { tick } from "svelte"

  let searchInput
  let searchString
  let searching = false

  $: filteredApps = $apps.filter(app => {
    return (
      !searchString ||
      app.name.toLowerCase().includes(searchString.toLowerCase())
    )
  })

  const startSearching = async () => {
    searching = true
    searchString = ""
    await tick()
    searchInput.focus()
  }

  const stopSearching = () => {
    searching = false
    searchString = ""
  }
</script>

<div class="side-bar" class:collapsed={$sideBarCollapsed}>
  <div class="side-bar-controls">
    {#if searching}
      <input
        bind:this={searchInput}
        bind:value={searchString}
        placeholder="Search"
      />
      <Icon hoverable on:click={stopSearching} name="Close" size="S" />
    {:else}
      <Body size="S">Apps</Body>
      <Icon name="Search" size="S" hoverable on:click={startSearching} />
    {/if}
    <Icon name="Add" hoverable on:click={() => $goto("./create")} />
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
    flex: 0 0 300px;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    border-right: var(--border-light);
    background: var(--spectrum-global-color-gray-100);
    overflow: hidden;
    transition: margin-left 300ms ease-out;
  }
  .side-bar.collapsed {
    margin-left: -302px;
  }

  .side-bar-controls {
    flex: 0 0 32px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: var(--spacing-l);
    padding: 0 var(--spacing-l);
    margin: var(--spacing-s);
  }
  .side-bar-controls :global(.spectrum-Body),
  .side-bar-controls input {
    flex: 1 1 auto;
  }
  .side-bar-controls :global(.spectrum-Icon) {
    color: var(--spectrum-global-color-gray-600);
  }

  input {
    outline: none;
    border: none;
    max-width: none;
    flex: 1 1 auto;
    padding: 0 38px 0 0;
    color: var(--spectrum-global-color-gray-800);
    font-size: 14px;
    transition: border 130ms ease-out;
    font-family: var(--font-sans);
    background: inherit;
  }
  input::placeholder {
    color: var(--spectrum-global-color-gray-700);
    transition: color 130ms ease-out;
  }
  input:hover::placeholder {
    color: var(--spectrum-global-color-gray-800);
  }

  .side-bar-nav {
    flex: 1 1 auto;
    padding: 0 16px;
    display: flex;
    flex-direction: column;
    justify-items: flex-start;
    align-items: stretch;
    gap: 6px;
    overflow: auto;
    overflow-x: hidden;
  }
</style>
