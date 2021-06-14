<script>
  import Mobile from "./Mobile.svelte"
  import {
    ActionButton,
    SideNavigation,
    SideNavigationItem as Item,
  } from "@budibase/bbui"

  export let navigation
  export let links
  export let mobileOpen = false
</script>

<div class="container">
  {#if navigation === "Top"}
    <ul>
      {#each links as { text, url }}
        <li><a href={url}>{text}</a></li>
      {/each}
    </ul>
  {:else}
    <SideNavigation>
      {#each links as { text, url }}
        <!-- Needs logic to select current route -->
        <Item selected={false} href="/">{text}</Item>
      {/each}
    </SideNavigation>
  {/if}
</div>
<div class="mobile">
  <ActionButton
    quiet
    selected
    icon="ShowMenu"
    on:click={() => (mobileOpen = !mobileOpen)}
  />
  {#if mobileOpen}
    <Mobile {links} on:click={() => (mobileOpen = !mobileOpen)} />
  {/if}
</div>

<style>
  .container {
    display: none;
  }
  ul {
    list-style-type: none;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }

  ul > * {
    margin-right: 16px;
  }

  :global(ul > a) {
    font-size: 1.5em;
    text-decoration: none;
    margin-right: 16px;
  }
  @media (min-width: 600px) {
    .mobile {
      display: none;
    }
    .container {
      display: initial;
    }
  }
</style>
