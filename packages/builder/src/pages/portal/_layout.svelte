<script>
  import { isActive, url, goto } from "@roxi/routify"
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
  import api from "builderStore/api"

  let orgName
  let orgLogo
  let onBoardingProgress
  let user

  async function getInfo() {
    // fetch orgInfo
    orgName = "ACME Inc."
    orgLogo = "https://via.placeholder.com/150"

    // set onBoardingProgress

    user = { name: "John Doe" }
  }

  onMount(getInfo)

  let menu = [
    { title: "Apps", href: "/portal" },
    { title: "Drafts", href: "/portal/drafts" },
    { title: "Users", href: "/portal/users", heading: "Manage" },
    { title: "Groups", href: "/portal/groups" },
    { title: "Auth", href: "/portal/oauth" },
    { title: "Email", href: "/portal/email" },
    { title: "General", href: "/portal/general", heading: "Settings" },
    { title: "Theming", href: "/portal/theming" },
    { title: "Account", href: "/portal/account" },
  ]
</script>

<div class="container">
  <Layout>
    <div class="nav">
      <div class="branding">
        <div class="name">
          <img src={orgLogo} alt="Logotype" />
          <span>{orgName}</span>
        </div>
        <div class="onboarding">
          <ProgressCircle size="S" value={onBoardingProgress} />
        </div>
      </div>
      <div class="menu">
        <Navigation>
          {#each menu as { title, href, heading }}
            <Item selected={$isActive(href)} {href} {heading}>{title}</Item>
          {/each}
        </Navigation>
      </div>
    </div>
  </Layout>
  <div class="main">
    <div class="toolbar">
      <Search />
      <div class="avatar">
        <Avatar size="M" name="John Doe" />
        <Icon size="XL" name="ChevronDown" />
      </div>
    </div>
    <div class="content">
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
  .main {
    display: grid;
    grid-template-rows: auto 1fr;
    border-left: 2px solid var(--spectrum-alias-background-color-primary);
  }
  .branding {
    display: grid;
    grid-template-columns: auto auto;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-xl);
  }
  .name {
    display: grid;
    grid-template-columns: auto auto;
    grid-gap: var(--spacing-m);
    align-items: center;
  }
  .content {
    padding: var(--spacing-m);
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
    border-bottom: 2px solid var(--spectrum-alias-background-color-primary);
    display: grid;
    grid-template-columns: 250px auto;
    justify-content: space-between;
    padding: var(--spacing-m) calc(var(--spacing-xl) * 2);
  }
  img {
    width: 32px;
    height: 32px;
  }
</style>
