<script>
  import { store, backendUiStore } from "builderStore"
  import { map, join } from "lodash/fp"
  import iframeTemplate from "./iframeTemplate"
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

  const getComponentTypeName = component => {
    let [componentName] = component._component.match(/[a-z]*$/)
    return componentName || "element"
  }

  const screenPlaceholder = {
    name: "Screen Placeholder",
    route: "*",
    props: {
      "_id": "49c3d0a2-7028-46f0-b004-7eddf62ad01c",
      "_component": "@budibase/standard-components/container",
      "_styles": {
        "normal": {
          "padding": "0px",
          "font-family": "Roboto",
          "border-width": "0",
          "border-style": "None",
          "text-align": "center"
        },
        "hover": {},
        "active": {},
        "selected": {}
      },
      "_code": "",
      "className": "",
      "onLoad": [],
      "type": "div",
      "_children": [
        {
          "_id": "335428f7-f9ca-4acd-9e76-71bc8ad27324",
          "_component": "@budibase/standard-components/container",
          "_styles": {
            "normal": {
              "padding": "16px",
              "border-style": "Dashed",
              "border-width": "2px",
              "border-color": "#8a8989fa"
            },
            "hover": {},
            "active": {},
            "selected": {}
          },
          "_code": "",
          "className": "",
          "onLoad": [],
          "type": "div",
          "_instanceId": "inst_b3b4e95_ab0df02dda3f4d8eb4b35eea2968bad3",
          "_instanceName": "Container",
          "_children": [
            {
              "_id": "ddb6a225-33ba-4ba8-91da-bc6a2697ebf9",
              "_component": "@budibase/standard-components/heading",
              "_styles": {
                "normal": {
                  "font-family": "Roboto"
                },
                "hover": {},
                "active": {},
                "selected": {}
              },
              "_code": "",
              "className": "",
              "text": "Your screens go here",
              "type": "h1",
              "_instanceId": "inst_b3b4e95_ab0df02dda3f4d8eb4b35eea2968bad3",
              "_instanceName": "Heading",
              "_children": []
            }
          ]
        }
      ],
      "_instanceName": "Content Placeholder"
    },
  }

  $: hasComponent = !!$store.currentPreviewItem

  $: {
    styles = ""
    // Apply the CSS from the currently selected page and its screens
    const currentPage = $store.pages[$store.currentPageName]
    styles += currentPage._css
    for (let screen of currentPage._screens) {
      styles += screen._css
    }
    styles = styles
  }

  $: stylesheetLinks = pipe($store.pages.stylesheets, [
    map(s => `<link rel="stylesheet" href="${s}"/>`),
    join("\n"),
  ])

  $: screensExist =
    $store.currentPreviewItem._screens &&
    $store.currentPreviewItem._screens.length > 0

  $: frontendDefinition = {
    appId: $store.appId,
    libraries: $store.libraries,
    page: $store.pages[$store.currentPageName],
    screens: [
      $store.currentFrontEndType === "page"
        ? screenPlaceholder
        : $store.currentPreviewItem,
    ],
  }

  $: selectedComponentType = getComponentTypeName($store.currentComponentInfo)

  $: selectedComponentId = $store.currentComponentInfo
    ? $store.currentComponentInfo._id
    : ""

  const refreshContent = () => {
    iframe.contentWindow.postMessage(
      JSON.stringify({
        styles,
        stylesheetLinks,
        selectedComponentType,
        selectedComponentId,
        frontendDefinition,
        appId: $store.appId,
        instanceId: $backendUiStore.selectedDatabase._id,
      })
    )
  }

  $: if (iframe)
    iframe.contentWindow.addEventListener("bb-ready", refreshContent, {
      once: true,
    })

  $: if (iframe && frontendDefinition) {
    refreshContent()
  }
</script>

<div class="component-container">
  {#if hasComponent && $store.currentPreviewItem}
    <iframe
      style="height: 100%; width: 100%"
      title="componentPreview"
      bind:this={iframe}
      srcdoc={iframeTemplate} />
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
