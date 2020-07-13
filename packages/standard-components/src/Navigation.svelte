<script>
  import { cssVars, createClasses } from "./cssVars"

  export let className = ""
  export let onLoad
  export let backgroundColor
  export let color
  export let borderWidth
  export let borderColor
  export let borderStyle
  export let logoUrl
  export let title
  export let _bb

  let itemContainer
  let hasLoaded
  let currentChildren

  $: cssVariables = {
    backgroundColor,
    color,
    borderWidth,
    borderColor,
    borderStyle,
  }

  $: {
    if (itemContainer) {
      _bb.attachChildren(itemContainer)
      if (!hasLoaded) {
        _bb.call(onLoad)
        hasLoaded = true
      }
    }
  }
</script>

<nav use:cssVars={cssVariables}>
  <a href="/">
    <img class="logo" alt="logo" src={logoUrl} height="48" />
    <span>{title}</span>
  </a>
  <div class="menu-items" bind:this={itemContainer} />
</nav>

<style>
  nav {
    color: var(--color);
    background-color: var(--backgroundColor);
    align-items: center;
    display: flex;
    font-weight: bold;
    justify-content: space-between;
    padding: 20px 0px;
  }

  nav > a {
    display: flex;
    align-items: center;
    font-size: 1.5em;
    color: var(--color);
    text-decoration: none;
  }

  nav a img {
    margin-right: 16px;
  }
  .menu-items {
    display: flex;
  }
  .menu-items > :global(*) {
    margin: 0 10px;
  }
</style>
