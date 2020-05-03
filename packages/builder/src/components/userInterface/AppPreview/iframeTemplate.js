export default ({
  styles,
  stylesheetLinks,
  selectedComponentId,
  frontendDefinition,
  currentPageFunctions
}) => `<html>
  <head>
    ${stylesheetLinks}

    <style>
      ${styles || ''}

      .pos-${selectedComponentId} {
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
    <\/style>
    <\script>
        window["##BUDIBASE_FRONTEND_DEFINITION##"] = ${frontendDefinition};
        window["##BUDIBASE_FRONTEND_FUNCTIONS##"] = ${currentPageFunctions};

        import('/_builder/budibase-client.esm.mjs')
        .then(module => {
            module.loadBudibase({ window, localStorage });
        })
    <\/script>
  </head>
  <body>
  </body>
</html>`