<script>
  export let title = ""
  export let favicon = ""

  export let clientLibPath
</script>

<svelte:head>
  <meta charset="utf8" />
  <meta name="viewport" content="width=device-width" />

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
  </style>
</svelte:head>

<body id="app">
  <script type="application/javascript" src={clientLibPath}>
  </script>
  <script type="application/javascript">
    loadBudibase()
  </script>
</body>
