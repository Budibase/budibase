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
        const { selectedComponentId, layout, screen } = JSON.parse(event.data)
        
        // Update selected component style
        if (selectedComponentStyle) {
          document.head.removeChild(selectedComponentStyle)
        }
        selectedComponentStyle = document.createElement("style");
        document.head.appendChild(selectedComponentStyle)
        var selectedCss = '[data-bb-id="' + selectedComponentId + '"]'  + '{border:2px solid #0055ff !important;}'
        selectedComponentStyle.appendChild(document.createTextNode(selectedCss))

        // Set some flags so the app knows we're in the builder
        window["##BUDIBASE_IN_BUILDER##"] = true;
        // TODO: need to update this
        window["##BUDIBASE_PREVIEW_PAGE##"] = layout;
        window["##BUDIBASE_PREVIEW_SCREEN##"] = screen;
        
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
