<script>
  import Modal from "svelte-simple-modal"
  import { Home as Link } from "@budibase/bbui"
  import {
    SettingsIcon,
    AppsIcon,
    UpdatesIcon,
    HostingIcon,
    DocumentationIcon,
    TutorialsIcon,
    CommunityIcon,
    ContributionIcon,
    BugIcon,
    EmailIcon,
    TwitterIcon,
  } from "components/common/Icons/"
</script>

<Modal>
  <div class="root">
    <div class="ui-nav">
      <div class="home-logo">
        <img src="/_builder/assets/budibase-logo.svg" alt="Budibase icon" />
      </div>

      <div class="nav-section">
        <div class="nav-section-title">Build</div>
        <Link icon={AppsIcon} title="Apps" href="/" active />
        <Link
          icon={HostingIcon}
          title="Hosting"
          href="https://portal.budi.live/" />
      </div>

      <div class="nav-section">
        <div class="nav-section-title">Learn</div>
        <Link
          icon={DocumentationIcon}
          title="Documentation"
          href="https://docs.budibase.com/" />
        <Link
          icon={CommunityIcon}
          title="Community"
          href="https://forum.budibase.com/" />
      </div>

      <div class="nav-section">
        <div class="nav-section-title">Contact</div>
        <Link
          icon={ContributionIcon}
          title="Contribute"
          href="https://github.com/Budibase/budibase" />
        <Link
          icon={BugIcon}
          title="Report bug"
          href="https://github.com/Budibase/budibase/issues" />
        <Link icon={EmailIcon} title="Email" href="mailto:hi@budibase.com" />
        <Link
          icon={TwitterIcon}
          title="Twitter"
          href="https://twitter.com/budibase" />
      </div>
    </div>

    <div class="main">
      <slot />
    </div>
  </div>
</Modal>

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
    background-color: var(--white);
    padding: 20px;
    display: flex;
    flex-direction: column;
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
    margin: 20px 0px;
    display: flex;
    flex-direction: column;
  }

  .nav-section-title {
    font-size: 20px;
    color: var(--ink);
    font-weight: 600;
    margin-bottom: 12px;
  }
</style>
