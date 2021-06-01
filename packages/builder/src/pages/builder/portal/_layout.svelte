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
  } from "@budibase/bbui"
  import ConfigChecklist from "components/common/ConfigChecklist.svelte"
  import { organisation, auth } from "stores/portal"
  import { onMount } from "svelte"
  import UpdateUserInfoModal from "components/settings/UpdateUserInfoModal.svelte"
  import ChangePasswordModal from "components/settings/ChangePasswordModal.svelte"
  import Logo from "assets/bb-emblem.svg"

  let loaded = false
  let userInfoModal
  let changePasswordModal

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
    } else {
      menu = menu.concat([
        {
          title: "Theming",
          href: "/builder/portal/settings/theming",
          heading: "Settings",
        },
      ])
    }
    return menu
  }

  onMount(async () => {
    // Prevent non-builders from accessing the portal
    if ($auth.user) {
      if (!$auth.user?.builder?.global) {
        $redirect("../")
      } else {
        await organisation.init()
        loaded = true
      }
    }
  })
</script>

{#if $auth.user && loaded}
  <div class="container">
    <div class="nav">
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
              <Item selected={$isActive(href)} {href} {heading}>{title}</Item>
            {/each}
          </Navigation>
        </div>
      </Layout>
    </div>
    <div class="main">
      <div class="toolbar">
        <div />
        <ActionMenu align="right">
          <div slot="control" class="avatar">
            <Avatar size="M" initials={$auth.initials} />
            <Icon size="XL" name="ChevronDown" />
          </div>
          <MenuItem icon="UserEdit" on:click={() => userInfoModal.show()}>
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
          <MenuItem icon="LogOut" on:click={auth.logout}>Log out</MenuItem>
        </ActionMenu>
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
{/if}

<style>
  .container {
    height: 100%;
    display: grid;
    grid-template-columns: 250px 1fr;
    align-items: stretch;
  }
  .nav {
    background: var(--background);
    border-right: var(--border-light);
    overflow: auto;
  }
  .main {
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
    display: grid;
    grid-template-columns: 250px auto;
    justify-content: space-between;
    padding: var(--spacing-m) calc(var(--spacing-xl) * 2);
    align-items: center;
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
</style>
