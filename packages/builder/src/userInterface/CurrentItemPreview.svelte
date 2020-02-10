<script>
  import { store } from "../builderStore"
  import { map, join } from "lodash/fp"
  import { pipe } from "../common/core"

  let iframe

  function transform_component(comp) {
    const props = comp.props || comp
    if (props && props._children && props._children.length) {
      props._children = props._children.map(transform_component)
    }

    return props
  }

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
    props:
      $store.currentPreviewItem &&
      transform_component($store.currentPreviewItem, true),
    hierarchy: $store.hierarchy,
    appRootPath: "",
  }
</script>

<div class="component-container">
  {#if hasComponent && $store.currentPreviewItem}
    <iframe
      style="height: 100%; width: 100%"
      title="componentPreview"
      bind:this={iframe}
      srcdoc={`<html>
  <head>
    ${stylesheetLinks}
    <style>
      ${styles || ''}
      body, html {
        height: 100%!important;
      }
    <\/style>
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
