<script>
  import { params, goto } from "@roxi/routify"
  import { apps, auth, sideBarCollapsed } from "stores/portal"
  import { ActionButton } from "@budibase/bbui"
  import { sdk } from "@budibase/shared-core"

  $: app = $apps.find(app => app.appId === $params.appId)
  $: iframeUrl = getIframeURL(app)
  $: isBuilder = sdk.users.isBuilder($auth.user, app?.devId)

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
    {#if isBuilder}
      <ActionButton
        quiet
        icon="Edit"
        on:click={() => $goto(`/builder/app/${app.devId}`)}
      >
        Edit
      </ActionButton>
    {/if}
    <ActionButton
      quiet
      icon="LinkOut"
      on:click={() => window.open(iframeUrl, "_blank")}
    >
      Fullscreen
    </ActionButton>
  </div>
  <iframe src={iframeUrl} title={app.name} />
</div>

<style>
  .container {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    padding: 0 var(--spacing-l) var(--spacing-l) var(--spacing-l);
  }
  .header {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: var(--spacing-xs);
    flex: 0 0 50px;
  }
  iframe {
    flex: 1 1 auto;
    border-radius: var(--spacing-s);
    border: 1px solid var(--spectrum-global-color-gray-300);
  }
</style>
