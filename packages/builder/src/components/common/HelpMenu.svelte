<script>
  import { Popover, Heading, Body, Icon } from "@budibase/bbui"
  import { licensing } from "@/stores/portal"
  import { isPremiumOrAbove } from "@/helpers/planTitle"
  import { ChangelogURL } from "@/constants"

  $: premiumOrAboveLicense = isPremiumOrAbove($licensing?.license?.plan?.type)

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
          <Icon name="x" />
        </button>
      </div>
      <div class="divider" />
      <a target="_blank" href="https://docs.budibase.com/docs">
        <div class="icon">
          <Icon name="book" />
        </div>
        <Body size="S">Help docs</Body>
      </a>
      <div class="divider" />
      <a target="_blank" href={ChangelogURL}>
        <div class="icon">
          <Icon name="list-bullets" />
        </div>
        <Body size="S">Changelog</Body>
      </a>
      <div class="divider" />
      <a
        target="_blank"
        href="https://github.com/Budibase/budibase/discussions"
      >
        <div class="icon">
          <Icon name="github-logo" />
        </div>
        <Body size="S">Discussions</Body>
      </a>
      <div class="divider" />
      <a target="_blank" href="https://discord.com/invite/ZepTmGbtfF">
        <div class="icon">
          <Icon name="discord-logo" />
        </div>
        <Body size="S">Discord</Body>
      </a>
      <div class="divider" />
      <a target="_blank" href="https://vimeo.com/showcase/budibase-university">
        <div class="icon">
          <Icon name="play" />
        </div>
        <Body size="S">Budibase University</Body>
      </a>
      <div class="divider" />
      <a
        href={premiumOrAboveLicense
          ? "mailto:support@budibase.com"
          : "/builder/portal/account/usage"}
      >
        <div class="premiumLinkContent" class:disabled={!premiumOrAboveLicense}>
          <div class="icon">
            <Icon name="envelope" />
          </div>
          <Body size="S">Email support</Body>
        </div>
        {#if !premiumOrAboveLicense}
          <div class="premiumBadge">
            <div class="icon">
              <Icon name="lock" />
            </div>
            <Body size="XS">Premium</Body>
          </div>
        {/if}
      </a>
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
    background-color: var(--bb-indigo);
    border-radius: 100px;
    color: white;
    border: none;
    font-size: 13px;
    font-weight: 600;
    padding: 10px 18px;
    transition: background-color 130ms ease-out;
  }
  .openMenu:hover {
    background-color: var(--bb-indigo-light);
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
    transition:
      filter 0.5s,
      background 0.13s ease-out;
  }

  a:hover {
    background-color: var(--spectrum-global-color-gray-200);
  }

  .icon {
    font-size: 13px;
    margin-right: 8px;
    min-width: 18px;
    justify-content: center;
    display: flex;
    color: var(--spectrum-global-color-gray-700);
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
