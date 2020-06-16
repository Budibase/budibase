export default `<html>
  <head>
    <style>
      body, html {
        height: 100%!important;
        font-family: Roboto !important;
      }
      .lay-__screenslot__text {
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px 0;
          border: dashed 2px #ccc;
          font-family: sans-serif;
          font-size: 1.2rem;
          color: #999;
          text-transform: uppercase;
          font-weight: bold;
        }
    </style>
    <script>
      function receiveMessage(event) { 

        if (!event.data) return

        const data = JSON.parse(event.data)

        try {
          if (styles) document.head.removeChild(styles)
        } catch(_) { }

        try {
          if (selectedComponentStyle) document.head.removeChild(selectedComponentStyle)
        } catch(_) { }

        selectedComponentStyle = document.createElement('style');
        document.head.appendChild(selectedComponentStyle)
        var selectedCss = '.' + data.selectedComponentType + '-' + data.selectedComponentId + '{ border: 2px solid #0055ff;  }'
        selectedComponentStyle.appendChild(document.createTextNode(selectedCss))

        styles = document.createElement('style')
        document.head.appendChild(styles)
        styles.appendChild(document.createTextNode(data.styles))

        window["##BUDIBASE_FRONTEND_DEFINITION##"] = data.frontendDefinition;
        if (clientModule) {
          clientModule.loadBudibase({ window, localStorage })
        }
      }
      let clientModule
      let styles
      let selectedComponentStyle

      document.addEventListener("click", function(e) {
        e.preventDefault()
        e.stopPropagation()
        return false;
      }, true)

      import('/_builder/budibase-client.esm.mjs')
      .then(module => {
        clientModule = module
        window.addEventListener('message', receiveMessage)
        window.dispatchEvent(new Event('bb-ready'))
      })
    </script>
  </head>
  <body>
  </body>
</html>`
