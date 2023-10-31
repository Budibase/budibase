<script>
  import { getContext } from "svelte"

  const { linkable, styleable } = getContext("sdk")
  const component = getContext("component")

  export let logoUrl
  export let hideLogo
</script>

<div class="nav" use:styleable={$component.styles}>
  {#if !hideLogo}
    <div class="nav__top">
      <a href="/" use:linkable>
        <img
          class="logo"
          alt="logo"
          src={logoUrl || "/builder/bblogo.png"}
          height="48"
        />
      </a>
    </div>
  {/if}
  <div class="nav__menu">
    <slot />
  </div>
</div>

<style>
  .nav {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
  }

  .nav__top {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 40px;
  }
  .nav__top img {
    margin-right: 16px;
  }

  .nav__menu {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: 16px;
  }

  :global(.nav__menu > a) {
    font-size: 1.5em;
    text-decoration: none;
  }
</style>
