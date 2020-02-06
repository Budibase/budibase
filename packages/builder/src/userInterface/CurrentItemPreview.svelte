<script>
  import { store } from "../builderStore"
  import { map, join } from "lodash/fp"
  import { pipe } from "../common/core"

  let iframe

  $: iframe &&
    console.log(
      iframe.contentDocument.head.insertAdjacentHTML(
        "beforeend",
        `<\style></style>`
      )
    )
  $: hasComponent = !!$store.currentPreviewItem
  $: styles = hasComponent ? $store.currentPreviewItem._css : ""

  $: stylesheetLinks = pipe(
    $store.pages.stylesheets,
    [map(s => `<link rel="stylesheet" href="${s}"/>`), join("\n")]
  )

  $: appDefinition = {
    componentLibraries: $store.loadLibraryUrls(),
    page: $store.pages[$store.currentPageName],
    screens: $store.pages[$store.currentPageName]._screens,
    hierarchy: $store.hierarchy,
    appRootPath: "",
  }
</script>

<div class="component-container">
  {#if hasComponent}
    <iframe
      style="height: 100%; width: 100%"
      title="componentPreview"
      bind:this={iframe}
      srcdoc={`<html>
  <head>
    ${stylesheetLinks}
    <\script>
        window["##BUDIBASE_APPDEFINITION##"] = ${JSON.stringify(appDefinition)};
        window["##BUDIBASE_UIFUNCTIONS"] = ${$store.currentScreenFunctions};

        import('/_builder/budibase-client.esm.mjs')
        .then(module => {
            module.loadBudibase({ window, localStorage });
        })
    <\/script>
  </head>
  <body>
  </body>
</html>`} />
  {/if}
</div>

<style>
  .component-container {
    grid-row-start: middle;
    grid-column-start: middle;
    position: relative;
    overflow: hidden;
    padding-top: 56.25%;
    margin: auto;
  }

  .component-container iframe {
    border: 0;
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    width: 100%;
  }
</style>
