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
      html, body {
        padding: 0;
        margin: 0;
      }
      html {
        height: calc(100% - 16px);
        width: calc(100% - 16px);
        overflow: hidden;
        margin: 8px;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: stretch;
      }
      html.loaded {
        box-shadow: 0 2px 8px -2px rgba(0, 0, 0, 0.1);
      }
      body {
        flex: 1 1 auto;
        overflow: hidden;
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
        const {
          selectedComponentId,
          layout,
          screen,
          previewType,
          appId,
          theme
        } = JSON.parse(event.data)

        // Set some flags so the app knows we're in the builder
        window["##BUDIBASE_IN_BUILDER##"] = true
        window["##BUDIBASE_APP_ID##"] = appId
        window["##BUDIBASE_PREVIEW_LAYOUT##"] = layout
        window["##BUDIBASE_PREVIEW_SCREEN##"] = screen
        window["##BUDIBASE_SELECTED_COMPONENT_ID##"] = selectedComponentId
        window["##BUDIBASE_PREVIEW_ID##"] = Math.random()
        window["##BUDIBASE_PREVIEW_TYPE##"] = previewType
        window["##BUDIBASE_PREVIEW_THEME##"] = theme

        // Initialise app
        try {
          if (window.loadBudibase) {
            window.loadBudibase()
            document.documentElement.classList.add("loaded")
            window.dispatchEvent(new Event("iframe-loaded"))
          } else {
            throw "The client library couldn't be loaded"
          }
        } catch (error) {
          window.dispatchEvent(new CustomEvent("error", { detail: error }))
        }
      }

      window.addEventListener("message", receiveMessage)
      window.dispatchEvent(new Event("ready"))
    </script>
  </head>
  <body/>
</html>
`
