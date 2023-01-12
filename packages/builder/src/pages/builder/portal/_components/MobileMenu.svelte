<script>
  import { Layout } from "@budibase/bbui"
  import { SideNav, SideNavItem } from "components/portal/page"
  import { createEventDispatcher } from "svelte"
  import { isActive } from "@roxi/routify"
  import UpgradeButton from "./UpgradeButton.svelte"
  import { fade } from "svelte/transition"
  import Logo from "./Logo.svelte"

  export let visible = false
  export let menu

  const dispatch = createEventDispatcher()

  const close = () => dispatch("close")
</script>

{#if visible}
  <div
    class="mobile-nav-underlay"
    transition:fade={{ duration: 130 }}
    on:click={close}
  />
{/if}
<div class="mobile-nav" class:visible>
  <Layout noPadding gap="M">
    <div on:click={close}>
      <Logo />
    </div>
    <SideNav>
      {#each menu as { title, href }}
        <SideNavItem
          text={title}
          url={href}
          active={$isActive(href)}
          on:click={close}
        />
      {/each}
    </SideNav>
    <div>
      <UpgradeButton on:click={close} />
    </div>
  </Layout>
</div>

<style>
  .mobile-nav {
    display: none;
  }

  @media (max-width: 640px) {
    .mobile-nav-underlay {
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
      background: rgba(0, 0, 0, 0.5);
    }
    .mobile-nav {
      transform: translateX(-100%);
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      padding: 16px 24px;
      height: 100%;
      width: 240px;
      background: var(--background);
      z-index: 2;
      transition: transform 130ms ease-out;
    }
    .mobile-nav.visible {
      transform: translateX(0);
    }
  }
</style>
