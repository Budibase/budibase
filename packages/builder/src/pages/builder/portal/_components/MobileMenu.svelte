<script>
  import { Layout } from "@budibase/bbui"
  import { SideNav, SideNavItem } from "components/portal/page"
  import { createEventDispatcher } from "svelte"
  import { isActive } from "@roxi/routify"
  import UpgradeButton from "./UpgradeButton.svelte"
  import { fade } from "svelte/transition"
  import Logo from "./Logo.svelte"
  import { menu } from "stores/portal"

  export let visible = false

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
      {#each $menu as { title, href, subPages }}
        {#if !subPages?.length}
          <SideNavItem
            text={title}
            url={href}
            active={$isActive(href)}
            on:click={close}
          />
        {/if}
      {/each}
      {#each $menu as { title, subPages }}
        {#if subPages?.length}
          <div class="category">{title}</div>
          {#each subPages as { title, href }}
            <SideNavItem
              text={title}
              url={href}
              active={$isActive(href)}
              on:click={close}
            />
          {/each}
        {/if}
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
  .category {
    color: var(--spectrum-global-color-gray-600);
    font-size: var(--font-size-s);
    margin-left: var(--spacing-m);
    margin-top: 24px;
    margin-bottom: 4px;
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
