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
      _id: "screenslot-placeholder",
      _component: "@budibase/standard-components/container",
      _styles: {
        normal: {},
        hover: {},
        active: {},
        selected: {},
      },
      _code: "",
      className: "",
      onLoad: [],
      type: "div",
      _children: [
        {
          _id: "51a1b494-0fa4-49c3-90cc-c2a6c7a3f888",
          _component: "@budibase/standard-components/container",
          _styles: {
            normal: {
              display: "flex",
              "flex-direction": "column",
              "align-items": "center",
            },
            hover: {},
            active: {},
            selected: {},
          },
          _code: "",
          className: "",
          onLoad: [],
          type: "div",
          _instanceId: "inst_40d9036_4c81114e2bf145ab8721978c66e09a10",
          _instanceName: "Container",
          _children: [
            {
              _id: "90a52cd0-f215-46c1-b29b-e28f9e7edf72",
              _component: "@budibase/standard-components/heading",
              _styles: {
                normal: {
                  width: "500px",
                  padding: "8px",
                },
                hover: {},
                active: {},
                selected: {},
              },
              _code: "",
              className: "",
<<<<<<< HEAD
              text: "Screenslot",
=======
              text: "Screen Slot",
>>>>>>> master
              type: "h1",
              _instanceId: "inst_40d9036_4c81114e2bf145ab8721978c66e09a10",
              _instanceName: "Heading",
              _children: [],
            },
            {
              _id: "71a3da65-72c6-4c43-8c6a-49871c07b77d",
              _component: "@budibase/standard-components/text",
              _styles: {
                normal: {
                  "max-width": "",
                  "text-align": "left",
                  width: "500px",
                  padding: "8px",
                },
                hover: {},
                active: {},
                selected: {},
              },
              _code: "",
              text:
                "The screens that you create will be displayed inside this box.",
              type: "none",
              _instanceId: "inst_40d9036_4c81114e2bf145ab8721978c66e09a10",
              _instanceName: "Text",
            },
            {
              _id: "8af80374-460d-497b-a5d8-7dd2ec4a7bbc",
              _component: "@budibase/standard-components/text",
              _styles: {
                normal: {
                  "max-width": "",
                  "text-align": "left",
                  width: "500px",
                  padding: "8px",
                },
                hover: {},
                active: {},
                selected: {},
              },
              _code: "",
              text:
                "This box is just a placeholder, to show you the position of screens.",
              type: "none",
              _instanceId: "inst_40d9036_4c81114e2bf145ab8721978c66e09a10",
              _instanceName: "Text",
            },
          ],
        },
      ],
      _instanceName: "Content Placeholder",
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
