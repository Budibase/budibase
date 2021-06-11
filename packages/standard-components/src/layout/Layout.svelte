<script>
  import Navigation from "./Navigation.svelte"
  import { ActionButton } from "@budibase/bbui"
  import { getContext } from "svelte"

  const { styleable, transition } = getContext("sdk")
  const component = getContext("component")
  export let title = ""
  export let hideTitle = false
  export let logoUrl = "https://i.imgur.com/Xhdt1YP.png"
  export let hideLogo = false
  export let navigation = "Top"
  export let links = [
    { text: "Some Text", url: "/" },
    { text: "Some Text", url: "/" },
  ]
  const navigationTypes = new Map([
    ["Top", "top"],
    ["Left", "left"],
    ["None", ""],
  ])
</script>

<div
  class="container {navigationTypes.get(navigation)}"
  in:transition={{ type: $component.transition }}
  use:styleable={$component.styles}
>
  {#if navigationTypes.get(navigation)}
    <div class="nav">
      <div class="logo">
        {#if !hideLogo}
          <img src={logoUrl} alt={title} height="48" />
        {/if}
        {#if !hideTitle}
          <span>{title}</span>
        {/if}
      </div>
      <div class="links">
        <Navigation {navigation} {links} />
      </div>
      <div class="portal">
        <ActionButton quiet icon="Apps" on:click />
      </div>
    </div>
  {/if}
  <div class="main">
    <slot />
  </div>
</div>

<style>
  .container {
    display: grid;
    grid-gap: 16px;
    grid-template-columns: 1fr;
    position: relative;
  }
  .nav {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-areas: "burger logo portal";
    justify-content: space-between;
    padding: var(--spacing-m);
  }
  .top,
  .left {
    grid-template-columns: 1fr;
  }
  .links {
    grid-area: burger;
  }
  .logo {
    display: grid;
    place-items: center;
    grid-area: logo;
  }
  .portal {
    grid-area: portal;
    display: grid;
    justify-content: end;
  }

  @media (min-width: 600px) {
    .nav {
      display: initial;
    }
    .top {
      grid-template-columns: 1fr;
    }
    .left {
      grid-template-columns: 200px 1fr;
    }
  }
</style>
