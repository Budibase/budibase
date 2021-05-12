<script>
  import { isActive, goto } from "@roxi/routify"
  import {
    Icon,
    Avatar,
    Search,
    Layout,
    SideNavigation as Navigation,
    SideNavigationItem as Item,
    ActionMenu,
    MenuItem,
    Modal,
  } from "@budibase/bbui"
  import ConfigChecklist from "components/common/ConfigChecklist.svelte"
  import { organisation } from "stores/portal"
  import { auth } from "stores/backend"
  import BuilderSettingsModal from "components/start/BuilderSettingsModal.svelte"

  let oldSettingsModal

  organisation.init()

  let menu = [
    { title: "Apps", href: "/builder/portal/apps" },
    { title: "Drafts", href: "/builder/portal/drafts" },
    { title: "Users", href: "/builder/portal/manage/users", heading: "Manage" },
    { title: "Groups", href: "/builder/portal/manage/groups" },
    { title: "Auth", href: "/builder/portal/manage/auth" },
    { title: "Email", href: "/builder/portal/manage/email" },
    {
      title: "General",
      href: "/builder/portal/settings/general",
      heading: "Settings",
    },
    { title: "Theming", href: "/builder/portal/theming" },
    { title: "Account", href: "/builder/portal/account" },
  ]
</script>

<div class="container">
  <div class="nav">
    <Layout paddingX="L" paddingY="L">
      <div class="branding">
        <div class="name" on:click={() => $goto("./apps")}>
          <img
            src={$organisation?.logoUrl || "https://i.imgur.com/ZKyklgF.png"}
            alt="Logotype"
          />
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
      <Search placeholder="Global search" />
      <ActionMenu align="right">
        <div slot="control" class="avatar">
          <Avatar size="M" name="John Doe" />
          <Icon size="XL" name="ChevronDown" />
        </div>
        <MenuItem icon="Settings" on:click={oldSettingsModal.show}>
          Old settings
        </MenuItem>
        <MenuItem icon="LogOut" on:click={auth.logout}>Log out</MenuItem>
      </ActionMenu>
    </div>
    <div class="content">
      <slot />
    </div>
  </div>
</div>
<Modal bind:this={oldSettingsModal} width="30%">
  <BuilderSettingsModal />
</Modal>

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
    font-weight: 500;
  }
  .content {
    overflow: auto;
    display: grid;
    grid-template-rows: 1fr;
  }
</style>
