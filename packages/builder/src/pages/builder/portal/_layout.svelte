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
  import UpdateUserInfoModal from "components/settings/UpdateUserInfoModal.svelte"
  import ChangePasswordModal from "components/settings/ChangePasswordModal.svelte"
  import Logo from "assets/bb-emblem.svg"
  // import { isEnabled, TENANT_FEATURE_FLAGS } from "helpers/featureFlags"

  let loaded = false
  let userInfoModal
  let changePasswordModal
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
    let menu = [
      {
        title: "Apps",
        href: "/builder/portal/apps",
      },
    ]

    if (admin) {
      menu = menu.concat([
        {
          title: "Users",
          href: "/builder/portal/users/users",
        },
        {
          title: "Plugins",
          href: "/builder/portal/plugins",
        },
        {
          title: "Usage",
          href: "/builder/portal/usage",
        },
        {
          title: "Settings",
          href: "/builder/portal/settings",
        },
      ])
      // if (!$adminStore.cloud) {
      //   menu = menu.concat([
      //     {
      //       title: "Update",
      //       href: "/builder/portal/settings/update",
      //     },
      //   ])
      // }
    }

    // add link to account portal if the user has access
    // let accountSectionAdded = false

    // link out to account-portal if account holder in cloud or always in self-host
    // if ($auth?.user?.accountPortalAccess || (!$adminStore.cloud && admin)) {
    //   accountSectionAdded = true
    //   menu = menu.concat([
    //     {
    //       title: "Account",
    //       href: $adminStore.accountPortalUrl,
    //       heading: "Account",
    //     },
    //   ])
    // }
    //
    // if (isEnabled(TENANT_FEATURE_FLAGS.LICENSING)) {
    //   // always show usage in self-host or cloud if licensing enabled
    //   menu = menu.concat([
    //     {
    //       title: "Usage",
    //       href: "/builder/portal/settings/usage",
    //       heading: accountSectionAdded ? "" : "Account",
    //     },
    //   ])
    //
    //   // show the relevant hosting upgrade page
    //   if ($adminStore.cloud && $auth?.user?.accountPortalAccess) {
    //     menu = menu.concat([
    //       {
    //         title: "Upgrade",
    //         href: $adminStore.accountPortalUrl + "/portal/upgrade",
    //       },
    //     ])
    //   } else if (!$adminStore.cloud && admin) {
    //     menu = menu.concat({
    //       title: "Upgrade",
    //       href: "/builder/portal/settings/upgrade",
    //     })
    //   }
    //
    //   // show the billing page to licensed account holders in cloud
    //   if (
    //     $auth?.user?.accountPortalAccess &&
    //     $auth.user.account.stripeCustomerId
    //   ) {
    //     menu = menu.concat([
    //       {
    //         title: "Billing",
    //         href: $adminStore.accountPortalUrl + "/portal/billing",
    //       },
    //     ])
    //   }
    // }

    menu = menu.filter(item => !!item)
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
        {#if !$adminStore.cloud && $auth.isAdmin}
          <Button
            size="S"
            cta
            on:click={() => $goto("/builder/portal/settings/upgrade")}
          >
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
              icon="UserEdit"
              on:click={() => userInfoModal.show()}
              dataCy={"user-info"}
            >
              Update user information
            </MenuItem>
            <MenuItem
              icon="LockClosed"
              on:click={() => changePasswordModal.show()}
            >
              Update password
            </MenuItem>
            <MenuItem icon="UserDeveloper" on:click={() => $goto("../apps")}>
              Close developer mode
            </MenuItem>
            <MenuItem dataCy="user-logout" icon="LogOut" on:click={logout}
              >Log out
            </MenuItem>
          </ActionMenu>
        </div>
      </div>
    </div>
    <div class="main">
      <slot />
    </div>
  </div>
  <Modal bind:this={userInfoModal}>
    <UpdateUserInfoModal />
  </Modal>
  <Modal bind:this={changePasswordModal}>
    <ChangePasswordModal />
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
    padding: 50px 50px 0 50px;
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
