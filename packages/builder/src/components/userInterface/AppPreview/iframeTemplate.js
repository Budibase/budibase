export default `<html>
  <head>
    <link rel="stylesheet" href="https://rsms.me/inter/inter.css">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto+Mono">
    <style>
      body, html {
        height: 100% !important;
        font-family: Inter !important;
        margin: 0px !important;
      }
      *, *:before, *:after {
        box-sizing: border-box;
      }
    </style>
    <script src='/assets/budibase-client.js'></script>
    <script>
      function receiveMessage(event) { 
        if (!event.data) {
          return
        }

        // Extract data from message
        const { selectedComponentId, page, screen } = JSON.parse(event.data)

        // Set some flags so the app knows we're in the builder
        window["##BUDIBASE_IN_BUILDER##"] = true
        window["##BUDIBASE_PREVIEW_PAGE##"] = page
        window["##BUDIBASE_PREVIEW_SCREEN##"] = screen
        window["##BUDIBASE_SELECTED_COMPONENT_ID##"] = selectedComponentId
        window["##BUDIBASE_PREVIEW_ID##"] = Math.random()
        
        // Initialise app
        if (window.loadBudibase) {
          loadBudibase()
        }
      }
      
      let selectedComponentStyle

      // Ignore clicks
      ["click", "mousedown"].forEach(type => {
        document.addEventListener(type, function(e) {
          e.preventDefault()
          e.stopPropagation()
          return false
        }, true)
      })

      window.addEventListener("message", receiveMessage)
      window.dispatchEvent(new Event("bb-ready"))
    </script>
  </head>
  <body>
  </body>
</html>`
