<script>
  import { isActive, redirect, goto, url } from "@roxi/routify"
  import { Icon, notifications, Tabs, Tab } from "@budibase/bbui"
  import { organisation, auth, admin as adminStore } from "stores/portal"
  import { onMount } from "svelte"
  import { isEnabled, TENANT_FEATURE_FLAGS } from "helpers/featureFlags"
  import UpgradeButton from "./_components/UpgradeButton.svelte"
  import MobileMenu from "./_components/MobileMenu.svelte"
  import Logo from "./_components/Logo.svelte"
  import UserDropdown from "./_components/UserDropdown.svelte"

  let loaded = false
  let mobileMenuVisible = false
  let activeTab = "Apps"

  $: menu = buildMenu($auth.isAdmin)
  $: $url(), updateActiveTab()

  const updateActiveTab = () => {
    for (let entry of menu) {
      if ($isActive(entry.href)) {
        if (activeTab !== entry.title) {
          activeTab = entry.title
        }
        break
      }
    }
  }

  const buildMenu = admin => {
    // Standard user and developer pages
    let menu = [
      {
        title: "Apps",
        href: "/builder/portal/apps",
      },
      {
        title: "Plugins",
        href: "/builder/portal/plugins",
      },
      {
        title: "Environment",
        href: "/builder/portal/environment",
      },
    ]

    // Admin only pages
    if (admin) {
      menu = [
        {
          title: "Apps",
          href: "/builder/portal/apps",
        },
        {
          title: "Users",
          href: "/builder/portal/users/users",
        },
        {
          title: "Plugins",
          href: "/builder/portal/plugins",
        },
        {
          title: "Settings",
          href: "/builder/portal/settings",
        },
      ]
    }

    // Check if allowed access to account section
    if (
      isEnabled(TENANT_FEATURE_FLAGS.LICENSING) &&
      ($auth?.user?.accountPortalAccess || (!$adminStore.cloud && admin))
    ) {
      menu.push({
        title: "Account",
        href: "/builder/portal/account",
      })
    }

    return menu
  }

  const showMobileMenu = () => (mobileMenuVisible = true)
  const hideMobileMenu = () => (mobileMenuVisible = false)

  onMount(async () => {
    // Prevent non-builders from accessing the portal
    if ($auth.user) {
      if (!$auth.user?.builder?.global) {
        $redirect("../")
      } else {
        try {
          await organisation.init()
        } catch (error) {
          notifications.error("Error getting org config")
        }
        loaded = true
      }
    }
  })
</script>

{#if $auth.user && loaded}
  <div class="container">
    <div class="nav">
      <div class="branding">
        <Logo />
      </div>
      <div class="desktop">
        <Tabs selected={activeTab}>
          {#each menu as { title, href }}
            <Tab {title} on:click={() => $goto(href)} />
          {/each}
        </Tabs>
      </div>
      <div class="mobile">
        <Icon hoverable name="ShowMenu" on:click={showMobileMenu} />
      </div>
      <div class="desktop">
        <UpgradeButton />
      </div>
      <div class="dropdown">
        <UserDropdown />
      </div>
    </div>
    <div class="main">
      <slot />
    </div>
    <MobileMenu visible={mobileMenuVisible} {menu} on:close={hideMobileMenu} />
  </div>
{/if}

<style>
  .container {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
  }
  .nav {
    background: var(--background);
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    border-bottom: var(--border-light);
    padding: 0 24px;
    gap: 24px;
    position: relative;
  }

  /* Customise tabs appearance*/
  .nav :global(.spectrum-Tabs) {
    margin-bottom: -2px;
    padding: 7px 0;
    flex: 1 1 auto;
  }
  .nav :global(.spectrum-Tabs-content) {
    display: none;
  }
  .nav :global(.spectrum-Tabs-itemLabel) {
    font-weight: 600;
  }

  .branding {
    display: grid;
    place-items: center;
  }
  .main {
    flex: 1 1 auto;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: stretch;
    overflow: auto;
  }
  .mobile {
    display: none;
  }
  .desktop {
    display: contents;
  }

  @media (max-width: 640px) {
    .mobile {
      display: contents;
    }
    .desktop {
      display: none;
    }
    .nav {
      flex: 0 0 52px;
      justify-content: space-between;
    }
    .branding {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translateX(-50%) translateY(-50%);
    }
  }
</style>
