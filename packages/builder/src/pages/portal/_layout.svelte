<script>
  import { onMount } from "svelte"
  import {
    Avatar,
    Search,
    Layout,
    ProgressCircle,
    SideNavigation as Navigation,
    SideNavigationItem as Item,
  } from "@budibase/bbui"

  let orgName, orgLogo, onBoardingProgress, user

  async function getInfo() {
    // fetch orgInfo
    orgName = "ACME Inc."
    orgLogo = "https://via.placeholder.com/150"

    // set onBoardingProgress
    onBoardingProgress = 20
    user = { name: "John Doe" }
  }

  onMount(getInfo)
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
          <Item>Apps</Item>
          <Item>Drafts</Item>
          <Item heading="Manage">Users</Item>
          <Item>Groups</Item>
          <Item>Auth</Item>
          <Item>Email</Item>
          <Item heading="Settings">General</Item>
          <Item>Theming</Item>
          <Item>Account</Item>
        </Navigation>
      </div>
    </div>
  </Layout>
  <div class="main">
    <div class="toolbar">
      <Search />
      <div class="avatar">
        <Avatar size="XL" name="John Doe" />
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
