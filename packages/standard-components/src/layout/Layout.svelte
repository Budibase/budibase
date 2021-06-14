<script>
  import { getContext } from "svelte"
  import { ActionButton, Heading } from "@budibase/bbui"

  const { styleable, linkable } = getContext("sdk")
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

  const navigationClasses = {
    Top: "top",
    Left: "left",
    None: "none",
  }

  $: type = navigationClasses[navigation] || "none"
  let mobileOpen = false
</script>

<div class="layout layout--{type}" use:styleable={$component.styles}>
  {#if type !== "none"}
    <div class="nav-wrapper">
      <div class="nav nav--{type}">
        <div class="burger">
          <ActionButton
            quiet
            icon="ShowMenu"
            on:click={() => (mobileOpen = !mobileOpen)}
          />
        </div>

        <div class="logo">
          {#if !hideLogo}
            <img src="https://i.imgur.com/Xhdt1YP.png" alt={title} />
          {/if}
          {#if !hideTitle}
            <Heading>{title}</Heading>
          {/if}
        </div>

        <div class="portal">
          <ActionButton quiet icon="Apps" on:click />
        </div>

        <div
          class="mobile-click-handler"
          class:visible={mobileOpen}
          on:click={() => (mobileOpen = false)}
        />
        <div class="links" class:visible={mobileOpen}>
          {#each links as { text, url, external }}
            {#if external}
              <a class="link" href={url}>{text}</a>
            {:else}
              <a class="link" href={url} use:linkable>{text}</a>
            {/if}
          {/each}
          <div class="close">
            <ActionButton
              quiet
              icon="Close"
              on:click={() => (mobileOpen = false)}
            />
          </div>
        </div>
      </div>
    </div>
  {/if}
  <div class="main-wrapper">
    <div class="main">
      <slot />
    </div>
  </div>
</div>

<style>
  /*  Main components */
  .layout {
    display: grid;
    position: relative;
    grid-template-columns: 1fr;
    min-height: 100%;
  }
  .nav-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: stretch;
    background: white;
  }
  .nav {
    flex: 1 1 auto;
    display: grid;
    padding: var(--spacing-xl);
    max-width: 1400px;
    grid-template-columns: 1fr auto;
  }
  .main-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: stretch;
  }
  .main {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    max-width: 1400px;
  }

  /*  Nav components */
  .burger {
    display: none;
  }
  .logo {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: var(--spacing-xl);
    grid-column: 1;
  }
  .logo img {
    height: 48px;
  }
  .portal {
    display: grid;
    justify-items: center;
    align-items: center;
    grid-column: 2;
  }
  .links {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: var(--spacing-l);
    grid-column: 1 / 3;
    grid-row: 2;
  }
  .link {
    color: var(--spectrum-alias-text-color);
    font-size: var(--spectrum-alias-font-size-default);
    font-weight: 600;
    transition: color 130ms ease-out;
  }
  .link:hover {
    color: var(--spectrum-alias-text-color-hover);
  }
  .close {
    display: none;
    position: absolute;
    top: var(--spacing-m);
    right: var(--spacing-m);
  }
  .mobile-click-handler {
    display: none;
  }

  /* Desktop nav overrides */
  @media (min-width: 600px) {
    .layout--top {
      grid-template-columns: 1fr;
      grid-template-rows: auto 1fr;
    }
    .layout--left {
      grid-template-columns: auto 1fr;
      grid-template-rows: 1fr;
      height: 100%;
    }

    .nav--top {
      grid-template-rows: auto auto;
      justify-content: space-between;
      gap: var(--spacing-xl);
    }
    .nav--left {
      grid-template-rows: auto 1fr;
      width: 250px;
      gap: var(--spacing-m);
    }

    .nav--top .links {
      margin-top: var(--spacing-l);
    }
    .nav--left .logo {
      gap: var(--spacing-m);
    }
    .nav--left .logo img {
      height: 28px;
    }
    .nav--left .logo :global(h1) {
      font-size: var(--spectrum-global-dimension-font-size-100);
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 0;
      flex: 1 1 auto;
    }
    .nav--left .links {
      margin-top: var(--spacing-l);
      flex-direction: column;
      justify-content: flex-start;
      align-items: stretch;
    }
    .layout--left .main-wrapper {
      height: 100%;
      overflow: auto;
    }
  }

  /* Mobile nav overrides */
  @media (max-width: 600px) {
    /* Always use top layout on mobile */
    .layout {
      grid-template-columns: 1fr;
      grid-template-rows: auto 1fr;
    }

    /* Show close button in drawer */
    .close {
      display: block;
    }

    /* Force standard top bar */
    .nav {
      justify-content: space-between;
      gap: var(--spacing-xl);
      grid-template-columns: auto auto auto;
      grid-template-rows: auto;
      padding: var(--spacing-m);
    }
    .burger {
      display: grid;
      place-items: center;
      grid-column: 1;
    }
    .logo {
      grid-column: 2;
    }
    .logo img {
      height: 36px;
    }
    .logo :global(h1) {
      display: none;
    }
    .portal {
      grid-column: 3;
    }

    /* Transform links into drawer */
    .links {
      position: fixed;
      top: 0;
      left: -250px;
      transform: translateX(0);
      width: 250px;
      transition: transform 0.26s ease-in-out, opacity 0.26s ease-in-out;
      height: 100vh;
      opacity: 0;
      background: white;
      z-index: 999;
      flex-direction: column;
      justify-content: flex-start;
      align-items: stretch;
      padding: var(--spacing-xl);
    }
    .link {
      width: calc(100% - 30px);
    }
    .links.visible {
      opacity: 1;
      transform: translateX(250px);
      box-shadow: 0 0 40px 20px rgba(0, 0, 0, 0.1);
    }
    .mobile-click-handler.visible {
      position: fixed;
      display: block;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: 998;
    }
  }
</style>
