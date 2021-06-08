export default `
<html>
  <head>
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
        margin: 0;
        padding: 0;
        height: 100%;
        width: 100%;
      }
      body {
        padding: 2px;
      }
  
      *,
      *:before,
      *:after {
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
  <body/>
</html>
`
