<script>
  import FontAwesomeIcon from "./FontAwesomeIcon.svelte"
  import { Popover, Heading, Body } from "@budibase/bbui"
  import { licensing } from "stores/portal"
  import { isEnabled, TENANT_FEATURE_FLAGS } from "helpers/featureFlags"

  $: isBusinessAndAbove =
    $licensing.isBusinessPlan || $licensing.isEnterprisePlan

  let show
  let hide
  let popoverAnchor
</script>

<div bind:this={popoverAnchor} class="help">
  <button class="openMenu" on:click={show}>Help</button>
  <Popover maxHeight={1000} bind:show bind:hide anchor={popoverAnchor}>
    <nav class="helpMenu">
      <div class="header">
        <Heading size="XS">Help resources</Heading>
        <button on:click={hide} class="closeButton">
          <FontAwesomeIcon name="fa-solid fa-xmark" />
        </button>
      </div>
      <div class="divider" />
      <a target="_blank" href="https://docs.budibase.com/docs">
        <div class="icon">
          <FontAwesomeIcon name="fa-solid fa-book" />
        </div>
        <Body size="S">Help docs</Body>
      </a>
      <div class="divider" />
      <a
        target="_blank"
        href="https://github.com/Budibase/budibase/discussions"
      >
        <div class="icon">
          <FontAwesomeIcon name="fa-brands fa-github" />
        </div>
        <Body size="S">Discussions</Body>
      </a>
      <div class="divider" />
      <a target="_blank" href="https://discord.com/invite/ZepTmGbtfF">
        <div class="icon">
          <FontAwesomeIcon name="fa-brands fa-discord" />
        </div>
        <Body size="S">Discord</Body>
      </a>
      <div class="divider" />
      <a target="_blank" href="https://vimeo.com/showcase/budibase-university">
        <div class="icon">
          <FontAwesomeIcon name="fa-solid fa-play" />
        </div>
        <Body size="S">Budibase University</Body>
      </a>
      <div class="divider" />
      {#if isEnabled(TENANT_FEATURE_FLAGS.LICENSING)}
        <a
          href={isBusinessAndAbove
            ? "mailto:support@budibase.com"
            : "/builder/portal/account/usage"}
        >
          <div class="premiumLinkContent" class:disabled={!isBusinessAndAbove}>
            <div class="icon">
              <FontAwesomeIcon name="fa-solid fa-envelope" />
            </div>
            <Body size="S">Email support</Body>
          </div>
          {#if !isBusinessAndAbove}
            <div class="premiumBadge">
              <div class="icon">
                <FontAwesomeIcon name="fa-solid fa-lock" />
              </div>
              <Body size="XS">Business</Body>
            </div>
          {/if}
        </a>
      {/if}
    </nav>
  </Popover>
</div>

<style>
  .help {
    z-index: 2;
    position: absolute;
    bottom: 24px;
    right: 24px;
  }

  .openMenu {
    cursor: pointer;
    background-color: #6a1dc8;
    border-radius: 100px;
    color: white;
    border: none;
    font-size: 13px;
    font-weight: 600;
    padding: 10px 18px;
  }

  .helpMenu {
    background-color: var(--background-alt);
    overflow: hidden;
    border-radius: 4px;
  }

  nav {
    min-width: 280px;
  }

  .divider {
    border-bottom: 1px solid var(--spectrum-global-color-gray-300);
  }

  .header {
    display: flex;
    align-items: center;
    padding: 0 0 0 16px;
  }

  .closeButton {
    cursor: pointer;
    font-size: 13px;
    color: var(--grey-6);
    background-color: transparent;
    border: none;
    padding: 18px 16px;
    margin-left: auto;
  }

  .closeButton:hover {
    color: var(--grey-8);
  }

  a {
    text-decoration: none;
    color: white;
    display: flex;
    padding: 12px;
    align-items: center;
    transition: filter 0.5s, background 0.13s ease-out;
  }

  a:hover {
    background-color: var(--spectrum-global-color-gray-200);
  }

  a:last-child {
    padding: 8px 12px;
  }

  .icon {
    font-size: 13px;
    margin-right: 7px;
    min-width: 18px;
    justify-content: center;
    display: flex;
  }

  .premiumLinkContent {
    display: flex;
    align-items: center;
  }

  .disabled {
    opacity: 60%;
  }

  .premiumBadge {
    align-items: center;
    margin-left: auto;
    display: flex;
    border: 1px solid var(--spectrum-global-color-gray-400);
    border-radius: 4px;
    padding: 4px 7px 5px 8px;
  }
</style>
