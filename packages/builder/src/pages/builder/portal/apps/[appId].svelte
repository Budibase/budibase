<script>
  import { params, goto } from "@roxi/routify"
  import { apps } from "stores/portal"
  import { Icon } from "@budibase/bbui"

  $: app = $apps.find(app => app.appId === $params.appId)
  $: iframeUrl = getIframeURL(app)
  $: preview = app?.status !== "published"

  const getIframeURL = app => {
    if (app.status === "published") {
      return `/app${app.url}`
    }
    return `/${app.devId}`
  }
</script>

<div class="container">
  <div class="header">
    <div class="icons">
      <Icon name="RailRightOpen" size="S" />
    </div>
    <div class="text">
      {#if preview}
        This is a preview of your unpublished app
      {/if}
    </div>
    <div class="icons">
      <Icon
        name="Edit"
        hoverable
        on:click={() => $goto(`../../app/${app.devId}`)}
        size="S"
      />
      <Icon
        name="LinkOut"
        hoverable
        on:click={() => window.open(iframeUrl, "_blank")}
        size="S"
      />
    </div>
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
    gap: 10px;
    padding: 10px 10px 10px 0;
  }
  .header {
    flex: 0 0 32px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 8px;
  }
  .icons {
    display: flex;
    gap: 24px;
  }
  iframe {
    flex: 1 1 auto;
    border-radius: 8px;
    border: none;
  }
</style>
