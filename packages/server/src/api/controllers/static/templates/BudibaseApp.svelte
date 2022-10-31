<script>
  export let title = ""
  export let favicon = ""
  export let metaImage = ""
  export let url = ""

  export let clientLibPath
  export let usedPlugins
</script>

<svelte:head>
  <meta charset="utf8" />
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0, viewport-fit=cover"
  />
  <!-- Opengraph Meta Tags -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@budibase" />
  <meta name="twitter:image" content={metaImage} />
  <meta name="twitter:title" content="{title} - built with Budibase" />
  <meta property="og:site_name" content="Budibase" />
  <meta property="og:title" content="{title} - built with Budibase" />
  <meta property="og:type" content="website" />
  <meta property="og:image" content={metaImage} />

  <title>{title}</title>
  <link rel="icon" type="image/png" href={favicon} />
  <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
  <link rel="preconnect" href="https://fonts.gstatic.com" />
  <link
    href="https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@400;600;700&display=swap"
    rel="stylesheet"
  />
  <link
    href="https://cdn.jsdelivr.net/npm/remixicon@2.5.0/fonts/remixicon.css"
    rel="stylesheet"
  />
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
    <h1>There was an error loading your app</h1>
    <h2>
      The Budibase client library could not be loaded. Try republishing your
      app.
    </h2>
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
