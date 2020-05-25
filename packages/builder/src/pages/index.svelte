<script>
  import { store } from "builderStore"
  import AppList from "components/start/AppList.svelte"
  import { onMount } from "svelte"
  import ActionButton from "components/common/ActionButton.svelte"
  import IconButton from "components/common/IconButton.svelte"
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
  import Spinner from "components/common/Spinner.svelte"

  let promise = getApps()

  async function getApps() {
    const res = await fetch(`/api/applications`)
    const json = await res.json()

    if (res.ok) {
      return json
    } else {
      throw new Error(json)
    }
  }

</script>

<div class="root">
  <div class="ui-nav">
    <div class="home-logo">
      <img src="/_builder/assets/bb-logo.svg" alt="Budibase icon" />
    </div>

    <div class="nav-section">
      <div class="nav-section-title">Build</div>
      <div class="nav-item-home">
        <span class="nav-item-icon">
          <AppsIcon />
        </span>
        <div class="nav-item-title">Apps</div>
      </div>
      <div class="nav-item">
        <span class="nav-item-icon">
          <SettingsIcon />
        </span>
        <div class="nav-item-title">Settings</div>
      </div>
      <a href="https://budibase.con/login" target="_blank" class="nav-item"> 
        <span class="nav-item-icon">
          <UpdatesIcon />
        </span>
        <div class="nav-item-title">Updates</div>
      </a>
      <a href="https://budibase.con/login" target="_blank" class="nav-item"> 
        <span class="nav-item-icon">
          <HostingIcon />
        </span>
        <div class="nav-item-title">Hosting</div>
      </a>
    </div>

    <div class="nav-section">
      <div class="nav-section-title">Learn</div>
        <a href="https://docs.budibase.com/" target="_blank" class="nav-item">
        <span class="nav-item-icon">
          <DocumentationIcon />
        </span>
        <div class="nav-item-title">Documentation</div>
      </a>
      <a href="https://docs.budibase.com/tutorial/quick-start" target="_blank" class="nav-item">        
      <span class="nav-item-icon">
          <TutorialsIcon />
        </span>
        <div class="nav-item-title">Tutorials</div>
      </a>
      <a href="https://forum.budibase.com/" target="_blank" class="nav-item"> 
        <span class="nav-item-icon">
          <CommunityIcon />
        </span>
        <div class="nav-item-title">Community</div>
      </a>
    </div>

    <div class="nav-section">
      <div class="nav-section-title">Contact</div>
      <a href="https://github.com/Budibase/budibase/blob/master/CONTRIBUTING.md" target="_blank" class="nav-item"> 
        <span class="nav-item-icon">
          <ContributionIcon />
        </span>
        <div class="nav-item-title">Contribute to our product</div>
      </a>
      <a href="https://github.com/Budibase/budibase/issues" target="_blank" class="nav-item"> 
        <span class="nav-item-icon">
          <BugIcon />
        </span>
        <div class="nav-item-title">Report bug</div>
      </a>
      <a href="mailto:support@budibase.com" target="_blank" class="nav-item"> 
        <span class="nav-item-icon">
          <EmailIcon />
        </span>
        <div class="nav-item-title">Email</div>
      </a>
      <a href="https://twitter.com/budibase" target="_blank" class="nav-item"> 
        <span class="nav-item-icon">
          <TwitterIcon />
        </span>
        <div class="nav-item-title">Twitter</div>
      </a>
    </div>
  </div>

  <div class="main">
  <div class="welcome">Welcome to Budibase</div>
    <div class="banner">
      <div class="banner-content">
        <div class="banner-header">
         Every accomplishment starts with a decision to try.   
        </div>
        <button class="banner-button" type="button"><i class="ri-add-circle-fill"></i>
            Create New Web App
        </button>
      </div>
      <div class="banner-image">
        <img src="/_builder/assets/banner-image.png" alt="Bannerimage" />
     </div>
    </div>
  {#await promise}
    <div class="spinner-container">
      <Spinner />
    </div>
  {:then result}
    <AppList apps={result} />
  {:catch err}
    <h1 style="color:red">{err}</h1>
  {/await}
  </div>  
</div>

<style>
  .root {
    display: grid;
    grid-template-columns: 275px 1fr;
    height: 100%;
    width: 100%;
    background: var(--grey-light);
  }

  @media only screen and (min-width: 1800px) {
    .root {
      display: grid;
      grid-template-columns: 300px 1fr;
      height: 100%;
      width: 100%;
      background: var(--grey-light);
    }
  }

  .main {
    grid-column: 2;
  }

  .ui-nav {
    grid-column: 1;
    background-color: var(--white);
    padding: 20px;
    display: flex;
    flex-direction: column;
    border-right: 1px solid var(--grey-dark)
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
    font-weight: 700;
    margin-bottom: 12px;
  }

  .nav-item {
    cursor: pointer;
    margin: 0px 0px 4px 0px;
    padding: 0px 0px 0px 12px;
    height: 40px;
    display: flex;
    flex-direction: row;
    align-items: center;
    box-sizing: border-box;
  }

  .nav-item-home {
    cursor: pointer;
    margin: 0px 0px 4px 0px;
    padding: 0px 0px 0px 12px;
    height: 40px;
    display: flex;
    flex-direction: row;
    align-items: center;
    box-sizing: border-box;
    background-color: var(--blue-light);
  }

  .nav-item:hover {
    background-color: var(--grey-light);
    border-radius: 3px;
  }

  .nav-item::selection {
    background-color: var(--blue-light);
    border-radius: 3px;
  }

  .nav-item-title {
    font-size: 14px;
    color: var(--ink);
    font-weight: 500;
    margin-left: 12px;
  }

  .nav-item-icon {
    color: var(--ink-light);
  }

  .welcome {
    margin: 60px 80px 0px 80px;
    font-size: 42px;
    color: var(--ink);
    font-weight: 900;
  }

  .banner {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 20px;
    margin: 20px 80px 40px 80px;
    background-image: linear-gradient(-45deg, #7F9CEB, #1D2F77);
    border-radius: 10px;
    max-height: 280px;
  }

  .banner-content {
    padding: 80px;
  }
  
  .banner-header {
    font-size: 36px;
    color: var(--white);
    font-weight: 500;
    margin-bottom: 20px;
  }

  .banner-image {
    z-index: 1;
  }

  .banner-image img {
    max-height: 400px;
  }

  .spinner-container {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .banner-button {
    background-color: var(--white);
    color: var(--ink);
    padding: 12px 20px;
    border-radius: 5px;
    border: 0px transparent solid;
    font-size: 16px;
    font-weight: 400;
    cursor: pointer;
    transition: all 0.2s;
    box-sizing: border-box;
    align-items: center;
    display: flex;
  }
  
  .ri-add-circle-fill {
    margin-right: 4px;
    font-size: 24px;
  }

  .banner-button:hover {
    background-color: var(--grey);
  }
</style>
