<script>
  import { store, backendUiStore } from "builderStore"
  import { map, join } from "lodash/fp"
  import iframeTemplate from "./iframeTemplate";
  import { pipe } from "components/common/core"

  let iframe
  let styles = ""

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
  $: {
    // Apply the CSS from the currently selected page and its screens 
    const currentPage = $store.pages[$store.currentPageName];
    styles += currentPage._css;
    for (let screen of currentPage._screens) {
      styles += screen._css;
    }
    styles = styles
  }

  $: stylesheetLinks = pipe(
    $store.pages.stylesheets,
    [map(s => `<link rel="stylesheet" href="${s}"/>`), join("\n")]
  )

  $: screensExist = $store.currentPreviewItem._screens && $store.currentPreviewItem._screens.length > 0 

  $: frontendDefinition = {
    appId: $store.appId,
    libraries: Object.keys($store.libraries),
    page: $store.currentPreviewItem,
    screens: screensExist ? $store.currentPreviewItem._screens : [{
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
    appRootPath: ""
  }

  $: selectedComponentId = $store.currentComponentInfo ? $store.currentComponentInfo._id : ""
</script>

<div class="component-container">
  {#if hasComponent && $store.currentPreviewItem}
    <iframe
      style="height: 100%; width: 100%"
      title="componentPreview"
      bind:this={iframe}
      srcdoc={iframeTemplate({
        styles,
        stylesheetLinks,
        selectedComponentId,
        frontendDefinition: JSON.stringify(frontendDefinition),
        currentPageFunctions: $store.currentPageFunctions
      })} />
  {/if}
</div>

<style>
  .component-container {
    grid-row-start: middle;
    grid-column-start: middle;
    position: relative;
    overflow: hidden;
    margin: auto;
    height: 100%;
  }

  .component-container iframe {
    border: 0;
    left: 0;
    top: 0;
    width: 100%;
  }
</style>
