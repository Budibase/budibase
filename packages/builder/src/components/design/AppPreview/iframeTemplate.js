export default `
<html>
  <head>
    <link rel="stylesheet" href="https://rsms.me/inter/inter.css">
    <link href="https://cdn.jsdelivr.net/npm/remixicon@2.5.0/fonts/remixicon.css" rel="stylesheet">
    <style>
      body, html {
        height: 100% !important;
        font-family: Inter, sans-serif !important;
        margin: 0 !important;
      }
      *, *:before, *:after {
        box-sizing: border-box;
      }
    </style>
    <script src='{{ CLIENT_LIB_PATH }}'></script>
    <script>
      function receiveMessage(event) { 
        if (!event.data) {
          return
        }

        // Extract data from message
        const { selectedComponentId, layout, screen, previewType, appId } = JSON.parse(event.data)

        // Set some flags so the app knows we're in the builder
        window["##BUDIBASE_IN_BUILDER##"] = true
        window["##BUDIBASE_APP_ID##"] = appId
        window["##BUDIBASE_PREVIEW_LAYOUT##"] = layout
        window["##BUDIBASE_PREVIEW_SCREEN##"] = screen
        window["##BUDIBASE_SELECTED_COMPONENT_ID##"] = selectedComponentId
        window["##BUDIBASE_PREVIEW_ID##"] = Math.random()
        window["##BUDIBASE_PREVIEW_TYPE##"] = previewType

        // Initialise app
        if (window.loadBudibase) {
          loadBudibase()
        }
      }

      window.addEventListener("message", receiveMessage)
      window.dispatchEvent(new Event("bb-ready"))
    </script>
  </head>
  <body>
  asdasd
  </body>
</html>
`
