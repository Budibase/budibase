<script>
  import { onMount, onDestroy } from "svelte"
  import { params, goto } from "@roxi/routify"
  import { licensing, apps, auth, sideBarCollapsed } from "stores/portal"
  import { Link, Body, ActionButton } from "@budibase/bbui"
  import { sdk } from "@budibase/shared-core"
  import { API } from "api"
  import ErrorSVG from "./ErrorSVG.svelte"
  import { ClientAppSkeleton } from "@budibase/frontend-core";

  $: app = $apps.find(app => app.appId === $params.appId)
  $: iframeUrl = getIframeURL(app)
  $: isBuilder = sdk.users.isBuilder($auth.user, app?.devId)

  let loading = true;

  const getIframeURL = app => {
    loading = true;
    console.log("loading");

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

  const receiveMessage = async message => {
    if (message.data.type === "docLoaded") {
      loading = false;
    }
  }

  onMount(() => {
    window.addEventListener("message", receiveMessage)
  })

  onDestroy(() => {
    window.removeEventListener("message", receiveMessage)
  })
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
      disabled={noScreens}
      quiet
      icon="LinkOut"
      on:click={() => window.open(iframeUrl, "_blank")}
    >
      Fullscreen
    </ActionButton>
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
    
    <div class:hide={!loading} class="loading">
      <div class={`loadingThemeWrapper ${app.theme}`}>
        <ClientAppSkeleton
          noAnimation
          hideDevTools={app?.status === "published"}
          sideNav={app?.navigation.navigation === "Left"}
          hideFooter={$licensing.brandingEnabled}
        />
      </div>
    </div>
    <iframe class:hide={loading} src={iframeUrl} title={app.name} />
  {/if}

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

  .loading {
    height: 100%;
    border: 1px solid var(--spectrum-global-color-gray-300);
    border-radius: var(--spacing-s);
    overflow: hidden;
  }
  .loadingThemeWrapper {
    height: 100%;
    container-type: inline-size;
  }

  .hide {
    visibility: hidden;
    height: 0;
    border: none;
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
