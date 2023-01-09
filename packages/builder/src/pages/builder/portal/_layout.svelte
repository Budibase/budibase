<script>
  import { isActive, redirect, goto, url } from "@roxi/routify"
  import {
    Icon,
    Avatar,
    ActionMenu,
    MenuItem,
    Modal,
    notifications,
    Tabs,
    Tab,
    Button,
  } from "@budibase/bbui"
  import { organisation, auth, admin as adminStore } from "stores/portal"
  import { onMount } from "svelte"
  import ProfileModal from "components/settings/ProfileModal.svelte"
  import ChangePasswordModal from "components/settings/ChangePasswordModal.svelte"
  import ThemeModal from "components/settings/ThemeModal.svelte"
  import APIKeyModal from "components/settings/APIKeyModal.svelte"
  import Logo from "assets/bb-emblem.svg"
  import { isEnabled, TENANT_FEATURE_FLAGS } from "helpers/featureFlags"

  let loaded = false
  let themeModal
  let profileModal
  let updatePasswordModal
  let apiKeyModal
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

  const logout = async () => {
    try {
      await auth.logout()
    } catch (error) {
      // Swallow error and do nothing
    }
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
      <div class="branding" on:click={() => $goto("./apps")}>
        <img src={Logo} alt="Logotype" />
      </div>
      <Tabs selected={activeTab}>
        {#each menu as { title, href }}
          <Tab {title} on:click={() => $goto(href)} />
        {/each}
      </Tabs>
      <div class="toolbar">
        <div class="mobile-toggle">
          <Icon hoverable name="ShowMenu" on:click={showMobileMenu} />
        </div>
        <div class="mobile-logo">
          <img
            src={$organisation?.logoUrl || Logo}
            alt={$organisation?.company || "Budibase"}
          />
        </div>
        {#if $adminStore.cloud && $auth?.user?.accountPortalAccess}
          <Button
            cta
            on:click={() => {
              $goto($adminStore.accountPortalUrl + "/portal/upgrade")
            }}
          >
            Upgrade
          </Button>
        {:else if !$adminStore.cloud && $auth.isAdmin}
          <Button cta on:click={() => $goto("/builder/portal/account/upgrade")}>
            Upgrade
          </Button>
        {/if}
        <div class="user-dropdown">
          <ActionMenu align="right" dataCy="user-menu">
            <div slot="control" class="avatar">
              <Avatar
                size="L"
                initials={$auth.initials}
                url={$auth.user.pictureUrl}
              />
              <Icon size="XL" name="ChevronDown" />
            </div>
            <MenuItem
              icon="Moon"
              on:click={() => themeModal.show()}
              dataCy="theme"
            >
              Theme
            </MenuItem>
            <MenuItem
              icon="UserEdit"
              on:click={() => profileModal.show()}
              dataCy="user-info"
            >
              My profile
            </MenuItem>
            <MenuItem
              icon="LockClosed"
              on:click={() => updatePasswordModal.show()}
            >
              Update password
            </MenuItem>
            <MenuItem
              icon="Key"
              on:click={() => apiKeyModal.show()}
              dataCy="api-key"
            >
              View API key
            </MenuItem>
            <MenuItem icon="UserDeveloper" on:click={() => $goto("../apps")}>
              Close developer mode
            </MenuItem>
            <MenuItem dataCy="user-logout" icon="LogOut" on:click={logout}>
              Log out
            </MenuItem>
          </ActionMenu>
        </div>
      </div>
    </div>
    <div class="main">
      <slot />
    </div>
  </div>
  <Modal bind:this={themeModal}>
    <ThemeModal />
  </Modal>
  <Modal bind:this={profileModal}>
    <ProfileModal />
  </Modal>
  <Modal bind:this={updatePasswordModal}>
    <ChangePasswordModal />
  </Modal>
  <Modal bind:this={apiKeyModal}>
    <APIKeyModal />
  </Modal>
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
    align-items: stretch;
    border-bottom: var(--border-light);
    padding: 0 20px;
    gap: 24px;
  }
  .nav :global(.spectrum-Tabs) {
    margin-bottom: -2px;
    padding: 7px 0;
  }
  .nav :global(.spectrum-Tabs-itemLabel) {
    font-weight: 600;
  }
  .branding {
    display: grid;
    place-items: center;
  }
  .avatar {
    display: grid;
    grid-template-columns: auto auto;
    place-items: center;
    grid-gap: var(--spacing-s);
  }
  .avatar:hover {
    cursor: pointer;
    filter: brightness(110%);
  }
  .toolbar {
    flex: 1 1 auto;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    gap: 24px;
  }
  .mobile-toggle,
  .mobile-logo {
    display: none;
  }
  .user-dropdown {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
  }
  img {
    width: 30px;
    height: 30px;
  }

  .main {
    flex: 1 1 auto;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: stretch;
    overflow: auto;
  }

  @media (max-width: 640px) {
    .toolbar {
      background: var(--background);
      border-bottom: var(--border-light);
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      padding: var(--spacing-m) calc(var(--spacing-xl) * 1.5);
    }

    .nav {
      position: absolute;
      left: -250px;
      height: 100%;
      transition: left ease-in-out 230ms;
      z-index: 100;
    }
    .nav.visible {
      left: 0;
      box-shadow: 0 0 80px 20px rgba(0, 0, 0, 0.3);
    }

    .mobile-toggle,
    .mobile-logo {
      display: block;
    }

    .mobile-toggle,
    .user-dropdown {
      flex: 0 1 0;
    }
  }
</style>
