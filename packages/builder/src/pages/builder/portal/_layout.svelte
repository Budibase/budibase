<script>
  import { isActive, redirect, goto } from "@roxi/routify"
  import {
    Icon,
    Avatar,
    Layout,
    SideNavigation as Navigation,
    SideNavigationItem as Item,
    ActionMenu,
    MenuItem,
    Modal,
    clickOutside,
    notifications,
  } from "@budibase/bbui"
  import ConfigChecklist from "components/common/ConfigChecklist.svelte"
  import { organisation, auth } from "stores/portal"
  import { admin as adminStore } from "stores/portal"
  import { onMount } from "svelte"
  import UpdateUserInfoModal from "components/settings/UpdateUserInfoModal.svelte"
  import ChangePasswordModal from "components/settings/ChangePasswordModal.svelte"
  import UpdateAPIKeyModal from "components/settings/UpdateAPIKeyModal.svelte"
  import Logo from "assets/bb-emblem.svg"
  import { isEnabled, FEATURE_FLAGS } from "../../../helpers/featureFlags"

  let loaded = false
  let userInfoModal
  let changePasswordModal
  let apiKeyModal
  let mobileMenuVisible = false

  $: menu = buildMenu($auth.isAdmin)

  const buildMenu = admin => {
    let menu = [{ title: "Apps", href: "/builder/portal/apps" }]
    if (admin) {
      menu = menu.concat([
        {
          title: "Users",
          href: "/builder/portal/manage/users",
          heading: "Manage",
        },
        { title: "Auth", href: "/builder/portal/manage/auth" },
        { title: "Email", href: "/builder/portal/manage/email" },
        {
          title: "Organisation",
          href: "/builder/portal/settings/organisation",
          heading: "Settings",
        },
        {
          title: "Theming",
          href: "/builder/portal/settings/theming",
        },
      ])

      if (!$adminStore.cloud) {
        menu = menu.concat([
          {
            title: "Update",
            href: "/builder/portal/settings/update",
          },
        ])

        if (isEnabled(FEATURE_FLAGS.LICENSING)) {
          menu = menu.concat({
            title: "Upgrade",
            href: "/builder/portal/settings/upgrade",
          })
        }
      }
    } else {
      menu = menu.concat([
        {
          title: "Theming",
          href: "/builder/portal/settings/theming",
          heading: "Settings",
        },
      ])
    }

    // add link to account portal if the user has access
    if ($auth?.user?.accountPortalAccess) {
      menu = menu.concat([
        {
          title: "Account",
          href: $adminStore.accountPortalUrl,
        },
      ])
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
    <div
      class="nav"
      class:visible={mobileMenuVisible}
      use:clickOutside={hideMobileMenu}
    >
      <Layout paddingX="L" paddingY="L">
        <div class="branding">
          <div class="name" on:click={() => $goto("./apps")}>
            <img src={$organisation?.logoUrl || Logo} alt="Logotype" />
            <span>{$organisation?.company || "Budibase"}</span>
          </div>
          <div class="onboarding">
            <ConfigChecklist />
          </div>
        </div>
        <div class="menu">
          <Navigation>
            {#each menu as { title, href, heading }}
              <Item
                on:click={hideMobileMenu}
                selected={$isActive(href)}
                {href}
                {heading}>{title}</Item
              >
            {/each}
          </Navigation>
        </div>
      </Layout>
    </div>
    <div class="main">
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
        <div class="user-dropdown">
          <ActionMenu align="right" dataCy="user-menu">
            <div slot="control" class="avatar">
              <Avatar
                size="M"
                initials={$auth.initials}
                url={$auth.user.pictureUrl}
              />
              <Icon size="XL" name="ChevronDown" />
            </div>
            <MenuItem
              icon="UserEdit"
              on:click={() => userInfoModal.show()}
              dataCy={"user-info"}
            >
              Update user information
            </MenuItem>
            {#if $auth.isBuilder}
              <MenuItem icon="Key" on:click={() => apiKeyModal.show()}>
                View API key
              </MenuItem>
            {/if}
            <MenuItem
              icon="LockClosed"
              on:click={() => changePasswordModal.show()}
            >
              Update password
            </MenuItem>
            <MenuItem icon="UserDeveloper" on:click={() => $goto("../apps")}>
              Close developer mode
            </MenuItem>
            <MenuItem icon="LogOut" on:click={logout}>Log out</MenuItem>
          </ActionMenu>
        </div>
      </div>
      <div class="content">
        <slot />
      </div>
    </div>
  </div>
  <Modal bind:this={userInfoModal}>
    <UpdateUserInfoModal />
  </Modal>
  <Modal bind:this={changePasswordModal}>
    <ChangePasswordModal />
  </Modal>
  <Modal bind:this={apiKeyModal}>
    <UpdateAPIKeyModal />
  </Modal>
{/if}

<style>
  .container {
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: stretch;
  }
  .nav {
    background: var(--background);
    border-right: var(--border-light);
    overflow: auto;
    flex: 0 0 auto;
    width: 250px;
  }
  .main {
    flex: 1 1 auto;
    display: grid;
    grid-template-rows: auto 1fr;
    overflow: hidden;
  }
  .branding {
    display: grid;
    grid-gap: var(--spacing-s);
    grid-template-columns: auto auto;
    justify-content: space-between;
    align-items: center;
  }
  .name {
    display: grid;
    grid-template-columns: auto auto;
    grid-gap: var(--spacing-m);
    align-items: center;
  }
  .name:hover {
    cursor: pointer;
  }
  .avatar {
    display: grid;
    grid-template-columns: auto auto;
    place-items: center;
    grid-gap: var(--spacing-xs);
  }
  .avatar:hover {
    cursor: pointer;
    filter: brightness(110%);
  }
  .toolbar {
    background: var(--background);
    border-bottom: var(--border-light);
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: var(--spacing-m) calc(var(--spacing-xl) * 2);
  }
  .mobile-toggle,
  .mobile-logo {
    display: none;
  }
  .user-dropdown {
    flex: 1 1 auto;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
  }
  img {
    width: 28px;
    height: 28px;
  }
  span {
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: 600;
  }
  .content {
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
      flex: 1 1 0;
    }

    /* Reduce BBUI page padding */
    .content :global(> *) {
      padding: calc(var(--spacing-xl) * 1.5) !important;
    }
  }
</style>
