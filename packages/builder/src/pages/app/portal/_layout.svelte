<script>
  import { isActive, goto } from "@roxi/routify"
  import { onMount } from "svelte"
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
  import { organisation, apps } from "stores/portal"
  import { auth } from "stores/backend"
  import BuilderSettingsModal from "components/start/BuilderSettingsModal.svelte"

  organisation.init()
  apps.load()

  let orgName
  let orgLogo
  let user
  let oldSettingsModal

  async function getInfo() {
    // fetch orgInfo
    orgName = "ACME Inc."
    orgLogo = "https://via.placeholder.com/150"
    user = { name: "John Doe" }
  }

  onMount(getInfo)

  let menu = [
    { title: "Apps", href: "/app/portal/apps" },
    { title: "Drafts", href: "/app/portal/drafts" },
    { title: "Users", href: "/app/portal/users", heading: "Manage" },
    { title: "Groups", href: "/app/portal/groups" },
    { title: "Auth", href: "/app/portal/oauth" },
    { title: "Email", href: "/app/portal/email" },
    {
      title: "General",
      href: "/app/portal/settings/general",
      heading: "Settings",
    },
    { title: "Theming", href: "/app/portal/theming" },
    { title: "Account", href: "/app/portal/account" },
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
    min-height: 100vh;
    display: grid;
    grid-template-columns: 250px 1fr;
  }
  .nav {
    background: var(--background);
    border-right: var(--border-light);
  }
  .main {
    display: grid;
    grid-template-rows: auto 1fr;
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
    height: 100vh;
    overflow-y: auto;
  }
</style>
