<script>
  import { Home as Link } from "@budibase/bbui"
  import {
    AppsIcon,
    HostingIcon,
    DocumentationIcon,
    CommunityIcon,
    BugIcon,
  } from "components/common/Icons"
  import BuilderSettingsButton from "components/start/BuilderSettingsButton.svelte"

  let modal
</script>

<div class="root">
  <div class="ui-nav">
    <div class="home-logo">
      <img src="/_builder/assets/budibase-logo.svg" alt="Budibase icon" />
    </div>

    <div class="nav-section">
      <div class="nav-top">
        <Link icon={AppsIcon} title="Apps" href="/" active />
        <Link
          icon={HostingIcon}
          title="Hosting"
          href="https://portal.budi.live/" />
        <Link
          icon={DocumentationIcon}
          title="Documentation"
          href="https://docs.budibase.com/" />
        <Link
          icon={CommunityIcon}
          title="Community"
          href="https://github.com/Budibase/budibase/discussions" />
        <Link
          icon={BugIcon}
          title="Raise an issue"
          href="https://github.com/Budibase/budibase/issues/new/choose" />
      </div>
      <div class="nav-bottom">
        <BuilderSettingsButton/>
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
    background: var(--grey-1);
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
