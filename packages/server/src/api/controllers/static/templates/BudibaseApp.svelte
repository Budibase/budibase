<script>
  import ClientAppSkeleton from "@budibase/frontend-core/src/components/ClientAppSkeleton.svelte"

  /** @type {BudibaseAppProps} this receives all the props in one structure, following
   * the type from @budibase/types */
  export let props
</script>

<svelte:head>
  <meta charset="utf8" />
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0, viewport-fit=cover"
  />

  <!-- Primary Meta Tags -->
  <meta name="title" content={props.metaTitle} />
  <meta name="description" content={props.metaDescription} />

  <!-- Opengraph Meta Tags -->
  <meta property="og:site_name" content="Budibase" />
  <meta property="og:title" content={props.metaTitle} />
  <meta property="og:description" content={props.metaDescription} />
  <meta property="og:type" content="website" />
  <meta property="og:image" content={props.metaImage} />

  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:site" content="@budibase" />
  <meta property="twitter:image" content={props.metaImage} />
  <meta property="twitter:image:alt" content={props.metaTitle} />
  <meta property="twitter:title" content={props.metaTitle} />
  <meta property="twitter:description" content={props.metaDescription} />

  <title>{props.title}</title>
  {#if props.favicon !== ""}
    <link rel="icon" type="image/png" href={props.favicon} />
  {:else}
    <link rel="icon" type="image/png" href="/builder/bblogo.png" />
  {/if}

  <link
    href="/builder/fonts/source-sans-3/source-sans-3.css"
    rel="stylesheet"
  />
  <link href="/builder/fonts/inter/inter.css" rel="stylesheet" />
  <link
    href="/builder/fonts/phosphor-icons/phosphor-icons.css"
    rel="stylesheet"
  />
  <link href="/builder/fonts/remixicon.css" rel="stylesheet" />

  <style>
    html,
    body {
      height: 100%;
      width: 100%;
      margin: 0;
      padding: 0;
    }
    *,
    *:before,
    *:after {
      box-sizing: border-box;
    }

    #error {
      position: absolute;
      top: 0;
      left: 0;
      height: 100vh;
      width: 100vw;
      display: none;
      font-family: "Source Sans 3", sans-serif;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background: #222;
      text-align: center;
      padding: 2rem;
      gap: 2rem;
    }
    #error h1,
    #error h2 {
      margin: 0;
    }
    #error h1 {
      color: #ccc;
      font-size: 3rem;
      font-weight: 600;
    }
    #error h2 {
      color: #888;
      font-weight: 400;
    }

    /* Inject latest font CSS from bbui.css, as the real file is versioned with the client lib */
    .spectrum {
      --font-sans:
        "Source Sans 3", -apple-system, BlinkMacSystemFont, Segoe UI, "Inter",
        "Helvetica Neue", Arial, "Noto Sans", sans-serif !important;
      --font-accent:
        "Source Sans 3", -apple-system, BlinkMacSystemFont, Segoe UI, "Inter",
        "Helvetica Neue", Arial, "Noto Sans", sans-serif !important;
      --spectrum-alias-body-text-font-family: var(--font-sans) !important;
      --spectrum-global-font-family-base: var(--font-sans) !important;
      --spectrum-global-font-line-height-small: 1.4 !important;
    }
  </style>

  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
  {@html props.headAppScripts || ""}
</svelte:head>

<body id="app">
  {#if props.showSkeletonLoader}
    <ClientAppSkeleton
      hideDevTools={props.hideDevTools}
      sideNav={props.sideNav}
      hideFooter={props.hideFooter}
    />
  {/if}
  <div id="error">
    {#if props.clientLibPath}
      <h1>There was an error loading your app</h1>
      <h2>
        The Budibase client library could not be loaded. Try republishing your
        app.
      </h2>
    {:else}
      <h2>We couldn't find that application</h2>
      <p />
    {/if}
  </div>
  {#if props.recaptchaKey}
    <script src="https://www.google.com/recaptcha/api.js"></script>
  {/if}
  <script type="application/javascript" nonce={props.nonce}>
    window.INIT_TIME = Date.now()
  </script>
  {#if props.appMigrating}
    <script type="application/javascript" nonce={props.nonce}>
      window.MIGRATING_APP = true
    </script>
  {/if}
  <script type="application/javascript" src={props.clientLibPath}>
  </script>
  <!-- Custom components need inserted after the core client library -->
  <!-- But before loadBudibase is called -->
  {#if props.usedPlugins?.length}
    {#each props.usedPlugins as plugin}
      <script type="application/javascript" src={plugin.jsUrl}></script>
    {/each}
  {/if}
  <script type="application/javascript" nonce={props.nonce}>
    if (window.loadBudibase) {
      window.loadBudibase()
    } else {
      console.error("Failed to load the Budibase client")
      document.getElementById("error").style.display = "flex"
    }
  </script>

  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
  {@html props.bodyAppScripts || ""}
</body>
