<script>
  import { isActive, url } from "@roxi/routify"
  import { onMount } from "svelte"
  import {
    Icon,
    Avatar,
    Search,
    Layout,
    ProgressCircle,
    SideNavigation as Navigation,
    SideNavigationItem as Item,
  } from "@budibase/bbui"
  import { organisation } from "stores/portal"
  organisation.init()

  let onBoardingProgress, user

  async function getInfo() {
    onBoardingProgress = 20
    user = { name: "John Doe" }
  }

  onMount(getInfo)

  let menu = [
    { title: "Apps", href: "/portal/apps" },
    { title: "Drafts", href: "/portal/drafts" },
    { title: "Users", href: "/portal/manage/users", heading: "Manage" },
    { title: "Groups", href: "/portal/manage/groups" },
    { title: "Auth", href: "/portal/manage/auth" },
    { title: "Email", href: "/portal/manage/email" },
    { title: "General", href: "/portal/settings/general", heading: "Settings" },
    { title: "Theming", href: "/portal/theming" },
    { title: "Account", href: "/portal/account" },
  ]
</script>

<div class="container">
  <div class="nav">
    <Layout paddingX="L" paddingY="L">
      <div class="branding">
        <div class="name">
          <img
            src={$organisation?.logoUrl || "https://i.imgur.com/ZKyklgF.png"}
            alt="Logotype"
          />
          <span>{$organisation?.company || "Budibase"}</span>
        </div>
        <div class="onboarding">
          <ProgressCircle size="S" value={onBoardingProgress} />
        </div>
      </div>
      <div class="menu">
        <Navigation>
          {#each menu as { title, href, heading }}
            <Item selected={$isActive(href)} href={$url(href)} {heading}>
              {title}
            </Item>
          {/each}
        </Navigation>
      </div>
    </Layout>
  </div>
  <div class="main">
    <div class="toolbar">
      <Search placeholder="Global search" />
      <div class="avatar">
        <Avatar size="M" name="John Doe" />
        <Icon size="XL" name="ChevronDown" />
      </div>
    </div>
    <div>
      <slot />
    </div>
  </div>
</div>

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
</style>
