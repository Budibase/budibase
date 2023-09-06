<script>
  import { params, goto } from "@roxi/routify"
  import { apps, sideBarCollapsed } from "stores/portal"
  import { ActionButton } from "@budibase/bbui"

  $: app = $apps.find(app => app.appId === $params.appId)
  $: iframeUrl = getIframeURL(app)

  const getIframeURL = app => {
    if (app.status === "published") {
      return `/app${app.url}`
    }
    return `/${app.devId}`
  }
</script>

<div class="container">
  <div class="header">
    {#if $sideBarCollapsed}
      <ActionButton
        quiet
        icon="Rail"
        on:click={() => sideBarCollapsed.set(false)}
      >
        Menu
      </ActionButton>
    {:else}
      <ActionButton
        quiet
        icon="RailRightOpen"
        on:click={() => sideBarCollapsed.set(true)}
      >
        Collapse
      </ActionButton>
    {/if}
    <ActionButton
      quiet
      icon="Edit"
      on:click={() => $goto(`../../app/${app.devId}`)}
    >
      Edit
    </ActionButton>
    <ActionButton
      quiet
      icon="LinkOut"
      on:click={() => window.open(iframeUrl, "_blank")}
    >
      Fullscreen
    </ActionButton>
  </div>
  <iframe src={iframeUrl} />
</div>

<style>
  .container {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: var(--spacing-s);
    padding: var(--spacing-s) var(--spacing-l) var(--spacing-l) var(--spacing-l);
  }
  .header {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: var(--spacing-xs);
  }
  iframe {
    flex: 1 1 auto;
    border-radius: var(--spacing-s);
    border: 1px solid var(--spectrum-global-color-gray-300);
  }
</style>
