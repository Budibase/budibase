<script>
  import { Icon, Body } from "@budibase/bbui"
  import { apps, sideBarCollapsed } from "stores/portal"
  import { params, goto } from "@roxi/routify"
  import { tick } from "svelte"
  import NavItem from "components/common/NavItem.svelte"

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
        placeholder="Search for apps"
      />
    {:else}
      <Body size="S">Apps</Body>
      <Icon name="Search" size="S" hoverable on:click={startSearching} />
    {/if}
    <div class="rotational" class:rotated={searching}>
      <Icon
        name="Add"
        hoverable
        on:click={searching ? stopSearching : () => $goto("./create")}
      />
    </div>
  </div>
  <div class="side-bar-nav">
    <NavItem
      icon="WebPages"
      text="All apps"
      on:click={() => $goto("./")}
      selected={!$params.appId}
    />
    {#each filteredApps as app}
      <NavItem
        text={app.name}
        icon={app.icon?.name || "Apps"}
        iconColor={app.icon?.color}
        selected={$params.appId === app.appId}
        on:click={() => $goto(`./${app.appId}`)}
      />
    {/each}
  </div>
</div>

<style>
  .side-bar {
    flex: 0 0 260px;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    border-right: var(--border-light);
    background: var(--spectrum-global-color-gray-100);
    overflow: hidden;
    transition: margin-left 300ms ease-out;
  }
  .side-bar.collapsed {
    margin-left: -262px;
  }
  @media (max-width: 640px) {
    .side-bar {
      margin-left: -262px;
    }
  }

  .side-bar-controls {
    flex: 0 0 50px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: var(--spacing-l);
    padding: 0 var(--spacing-l);
  }
  .side-bar-controls :global(.spectrum-Body),
  .side-bar-controls input {
    flex: 1 1 auto;
  }
  .side-bar-controls :global(.spectrum-Icon) {
    color: var(--spectrum-global-color-gray-700);
  }

  input {
    outline: none;
    border: none;
    max-width: none;
    flex: 1 1 auto;
    color: var(--spectrum-global-color-gray-800);
    font-size: 14px;
    padding: 0;
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
    overflow: auto;
    overflow-x: hidden;
  }

  div.rotational {
    transition: transform 130ms ease-out;
  }
  div.rotational.rotated {
    transform: rotate(45deg);
  }
</style>
