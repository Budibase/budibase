<script>
  import { params, goto } from "@roxi/routify"
  import {
    auth,
    sideBarCollapsed,
    enriched as enrichedApps,
  } from "stores/portal"
  import AppRowContext from "components/start/AppRowContext.svelte"
  import FavouriteAppButton from "../FavouriteAppButton.svelte"
  import {
    Link,
    Body,
    Button,
    Icon,
    TooltipPosition,
    TooltipType,
  } from "@budibase/bbui"
  import { sdk } from "@budibase/shared-core"
  import { API } from "api"
  import ErrorSVG from "./ErrorSVG.svelte"

  $: app = $enrichedApps.find(app => app.appId === $params.appId)
  $: iframeUrl = getIframeURL(app)
  $: isBuilder = sdk.users.isBuilder($auth.user, app?.devId)

  const getIframeURL = app => {
    if (app.status === "published") {
      return `/app${app.url}`
    }
    return `/${app.devId}`
  }

  let noScreens = false

  // Normally fetched in builder/src/pages/builder/app/[application]/_layout.svelte
  const fetchScreens = async appId => {
    if (!appId) return

    const pkg = await API.fetchAppPackage(appId)
    noScreens = pkg.screens.length === 0
  }

  $: fetchScreens(app?.devId)
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="container">
  <div class="header">
    {#if $sideBarCollapsed}
      <div class="headerButton" on:click={() => sideBarCollapsed.set(false)}>
        <Icon
          name={"Rail"}
          hoverable
          tooltip="Expand"
          tooltipPosition={TooltipPosition.Right}
          tooltipType={TooltipType.Info}
          hoverColor={"var(--ink)"}
        />
      </div>
    {:else}
      <div class="headerButton" on:click={() => sideBarCollapsed.set(true)}>
        <Icon
          name={"RailRightOpen"}
          hoverable
          tooltip="Collapse"
          tooltipType={TooltipType.Info}
          tooltipPosition={TooltipPosition.Top}
          hoverColor={"var(--ink)"}
          size="S"
        />
      </div>
    {/if}
    {#if isBuilder}
      <Button
        size="M"
        secondary
        on:click={() => $goto(`/builder/app/${app.devId}`)}
      >
        Edit
      </Button>
    {/if}
    <div class="headerButton">
      <FavouriteAppButton {app} />
    </div>
    <div class="headerButton" on:click={() => window.open(iframeUrl, "_blank")}>
      <Icon
        name="LinkOut"
        disabled={noScreens}
        hoverable
        tooltip="Open in new tab"
        tooltipType={TooltipType.Info}
        tooltipPosition={TooltipPosition.Top}
        hoverColor={"var(--ink)"}
        size="S"
      />
    </div>
    <AppRowContext
      {app}
      options={["duplicate", "delete", "exportDev", "exportProd"]}
      align="left"
    />
  </div>
  {#if noScreens}
    <div class="noScreens">
      <ErrorSVG />
      <Body>You haven't added any screens to your app yet.</Body>
      <Body>
        <Link size="L" href={`/builder/app/${app.devId}/design`}
          >Click here</Link
        > to add some.
      </Body>
    </div>
  {:else}
    <iframe src={iframeUrl} title={app.name} />
  {/if}
</div>

<style>
  .headerButton {
    color: var(--grey-7);
    cursor: pointer;
  }

  .headerButton:hover {
    color: var(--ink);
  }

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
    gap: var(--spacing-xl);
    flex: 0 0 50px;
  }

  iframe {
    flex: 1 1 auto;
    border-radius: var(--spacing-s);
    border: 1px solid var(--spectrum-global-color-gray-300);
  }

  .noScreens {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 20px;
    box-sizing: border-box;
  }

  .noScreens :global(svg) {
    width: 100px;
    height: 100px;
    margin-bottom: 10px;
  }
</style>
