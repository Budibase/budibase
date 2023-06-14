<script>
  export let title = ""
  export let favicon = ""

  export let metaImage = ""
  export let metaTitle = ""
  export let metaDescription = ""

  export let clientLibPath
  export let usedPlugins
</script>

<svelte:head>
  <meta charset="utf8" />
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0, viewport-fit=cover"
  />

  <!-- Primary Meta Tags -->
  <meta name="title" content={metaTitle} />
  <meta name="description" content={metaDescription} />

  <!-- Opengraph Meta Tags -->
  <meta property="og:site_name" content="Budibase" />
  <meta property="og:title" content={metaTitle} />
  <meta property="og:description" content={metaDescription} />
  <meta property="og:type" content="website" />
  <meta property="og:image" content={metaImage} />

  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:site" content="@budibase" />
  <meta property="twitter:image" content={metaImage} />
  <meta property="twitter:image:alt" content={metaTitle} />
  <meta property="twitter:title" content={metaTitle} />
  <meta property="twitter:description" content={metaDescription} />

  <title>{title}</title>
  {#if favicon !== ""}
    <link rel="icon" type="image/png" href={favicon} />
  {:else}
    <link rel="icon" type="image/png" href="/builder/bblogo.png" />
  {/if}

  <link href="/builder/fonts/source-sans-pro/400.css" rel="stylesheet" />
  <link href="/builder/fonts/source-sans-pro/600.css" rel="stylesheet" />
  <link href="/builder/fonts/source-sans-pro/700.css" rel="stylesheet" />
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
      font-family: "Source Sans Pro", sans-serif;
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
  </style>
</svelte:head>

<body id="app">
  <div id="error">
    {#if clientLibPath}
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
  <script type="application/javascript">
    window.INIT_TIME = Date.now()
  </script>
  <script type="application/javascript" src={clientLibPath}>
  </script>
  <!-- Custom components need inserted after the core client library -->
  <!-- But before loadBudibase is called -->
  {#if usedPlugins?.length}
    {#each usedPlugins as plugin}
      <script type="application/javascript" src={plugin.jsUrl}></script>
    {/each}
  {/if}
  <script type="application/javascript">
    if (window.loadBudibase) {
      window.loadBudibase()
    } else {
      console.error("Failed to load the Budibase client")
      document.getElementById("error").style.display = "flex"
    }
  </script>
</body>
