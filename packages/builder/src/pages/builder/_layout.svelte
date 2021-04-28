<script>
  import {
    SideNavigation as Navigation,
    SideNavigationItem as Item,
  } from "@budibase/bbui"
  import BuilderSettingsButton from "components/start/BuilderSettingsButton.svelte"
  import Logo from "/assets/budibase-logo.svg"
</script>

<div class="root">
  <div class="ui-nav">
    <div class="home-logo"><img src={Logo} alt="Budibase icon" /></div>
    <div class="nav-section">
      <div class="nav-top">
        <Navigation>
          <Item href="/builder/" icon="Apps" selected>Apps</Item>
          <Item external href="https://portal.budi.live/" icon="Servers">
            Hosting
          </Item>
          <Item external href="https://docs.budibase.com/" icon="Book">
            Documentation
          </Item>
          <Item
            external
            href="https://github.com/Budibase/budibase/discussions"
            icon="PeopleGroup"
          >
            Community
          </Item>
          <Item
            external
            href="https://github.com/Budibase/budibase/issues/new/choose"
            icon="Bug"
          >
            Raise an issue
          </Item>
        </Navigation>
      </div>
      <div class="nav-bottom">
        <BuilderSettingsButton />
      </div>
    </div>
  </div>
  <div class="main">
    <slot />
  </div>
</div>

<style>
  .root {
    display: grid;
    grid-template-columns: 260px 1fr;
    height: 100%;
    width: 100%;
  }

  .main {
    grid-column: 2;
    overflow: auto;
  }

  .ui-nav {
    grid-column: 1;
    background-color: var(--background);
    padding: 20px;
    display: flex;
    flex-direction: column;
    border-right: var(--border-light);
  }

  .home-logo {
    cursor: pointer;
    height: 40px;
    margin-bottom: 20px;
  }

  .home-logo img {
    height: 40px;
  }

  .nav-section {
    margin: 20px 0 0 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
  }
</style>
