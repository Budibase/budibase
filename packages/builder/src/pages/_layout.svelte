<script>
  import { Home as Link, Button } from "@budibase/bbui"
  import {
    AppsIcon,
    HostingIcon,
    DocumentationIcon,
    CommunityIcon,
    BugIcon,
  } from "components/common/Icons"
  import BuilderSettingsButton from "components/start/BuilderSettingsButton.svelte"

  let modal
  $: deprecationWarning = true
</script>

{#if deprecationWarning}
<div class="deprecation-root">
  
  <div class="deprecation-inner">
    <div class="deprecation-text">
      From the 25th of May, Budibase is moving to a self-hosted web experience in the browser.<br/> 
      We will cease development on the current Electron based desktop builder.
    </div>

    <div class="deprecation-actions">

      <a href="https://github.com/Budibase/budibase/discussions/1487" target="_blank">read more</a>

      <button on:click={() => deprecationWarning = false}>
        Close
      </button>
    </div>
  </div>
  
</div>
{/if}

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
        <BuilderSettingsButton />
      </div>
    </div>
  </div>
  <div class="main">
    <slot />
  </div>
</div>

<style>

  .deprecation-root {
    padding: 20px;
    background-color: var(--yellow-light);
    display: flex;
    justify-content: center;
  }

  .deprecation-inner {
    display: flex;
    max-width: 900px;
    align-items: center;
  }

  .deprecation-text {
    flex: 1 1 auto;
    color: black;
    text-align: center;
  }

  .deprecation-actions {
    flex: 0 0 auto;
    padding-left: 40px;
  }

  .deprecation-actions > a {
    color: white;
    border-color: black;
    background-color: black;
    font-size: var(--font-size-xs);
    padding: var(--spacing-xs) var(--spacing-m);
    font-family: var(--font-sans);
    cursor: pointer;
    font-weight: 600;
    box-sizing: border-box;
    overflow: hidden;
    border-radius: var(--border-radius-s);
    transition: all 0.2s ease 0s;
    display: inline-flex;
    text-rendering: optimizeLegibility;
    text-decoration: none;
    min-width: auto;
    outline: none;
    font-feature-settings: "case" 1, "rlig" 1, "calt" 0;
    -webkit-box-align: center;
    user-select: none;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    margin: 0;
    border-width: 2px;
    border-style: solid;
  }

  .deprecation-actions > a:hover {
    background-color: white;
    color: black;
  }

  .deprecation-actions > button {
    border-style: none;
    background-color: rgba(0,0,0,0);
    color: rgb(117, 117, 117);
    cursor: pointer;
    margin-left: 10px;
  }

  .deprecation-actions > button:hover {
    color: black;
  }

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
