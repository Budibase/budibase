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

  $: frontendDefinition = {
    componentLibraries: $store.loadLibraryUrls($store.currentPageName),
    page: $store.currentPreviewItem,
    screens: [{
      name: "Screen Placeholder",
      route: "*",
      props: {
        _component: "@budibase/standard-components/container",
        type: "div",
        _children: [
          {
            _component: "@budibase/standard-components/container",
            _styles: { "position": {},"layout": {} },
            _id: "__screenslot__text",
            _code: "",
            className: "",
            onLoad: [],
            type: "div",
            _children: [{
              _component:"@budibase/standard-components/text",
              _styles: { "position": {}, "layout": {} },
              _id: "__screenslot__text_2",
              _code: "",
              text: "content",
              font: "",
              color: "",
              textAlign: "inline",
              verticalAlign: "inline",
              formattingTag: "none"
            }]
          }
        ]
      }
    }],
    appRootPath: `/_builder/instance/${$store.appname}/${$store.currentInstanceId}/`,
  }

  $: backendDefinition = {
    hierarchy: $store.hierarchy,
  }

  $: selectedComponentId = $store.currentComponentInfo ? $store.currentComponentInfo._id : ""
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
        window["##BUDIBASE_FRONTEND_DEFINITION##"] = ${JSON.stringify(frontendDefinition)};
        window["##BUDIBASE_BACKEND_DEFINITION##"] = ${JSON.stringify(backendDefinition)};
        window["##BUDIBASE_FRONTEND_FUNCTIONS##"] = ${$store.currentPageFunctions};

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
