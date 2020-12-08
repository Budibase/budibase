<script>
  export let title = ""
  export let favicon = ""

  export let appId
  export let production

  export const PRODUCTION_ASSETS_URL = `https://${appId}.app.budi.live`

  function publicPath(path) {
    if (production) {
      return `${PRODUCTION_ASSETS_URL}/assets/${appId}/${path}`
    }

    return `/assets/${path}`
  }
</script>

<svelte:head>
  <meta charset="utf8" />
  <meta name="viewport" content="width=device-width" />

  <title>{title}</title>
  <link rel="icon" type="image/png" href={favicon} />

  <link rel="stylesheet" href={publicPath('bundle.css')} />

  <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css2?family=Roboto+Mono" />
  <style>
    html,
    body {
      font-family: Inter;
      height: 100%;
      width: 100%;
      margin: 0px;
      padding: 0px;
    }

    *,
    *:before,
    *:after {
      box-sizing: border-box;
    }
  </style>
</svelte:head>

<body id="app">
  <script src={publicPath('budibase-client.js')}>
  </script>
  <script>
    loadBudibase()
  </script>
</body>
