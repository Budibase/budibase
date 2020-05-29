export default ({
  styles,
  stylesheetLinks,
  selectedComponentType,
  selectedComponentId,
  frontendDefinition,
  currentPageFunctions,
}) => `<html>
  <head>
    ${stylesheetLinks}

    <style>
      ${styles || ""}

      .${selectedComponentType}-${selectedComponentId} {
        border: 2px solid #0055ff; 
      }

      body, html {
        height: 100%!important;
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
        window["##BUDIBASE_FRONTEND_DEFINITION##"] = ${frontendDefinition};

        import('/_builder/budibase-client.esm.mjs')
        .then(module => {
            module.loadBudibase({ window, localStorage });
        })
    </script>
  </head>
  <body>
  </body>
</html>`
