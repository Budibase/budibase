<script>
  import { store, backendUiStore } from "builderStore"
  import { map, join } from "lodash/fp"
  import iframeTemplate from "./iframeTemplate"
  import { pipe } from "../../../helpers"
  import { Screen } from "../../../builderStore/store/screenTemplates/utils/Screen"
  import { Component } from "../../../builderStore/store/screenTemplates/utils/Component"

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

  const headingStyle = {
    width: "500px",
    padding: "8px",
  }
  const textStyle = {
    ...headingStyle,
    "max-width": "",
    "text-align": "left",
  }

  const heading = new Component("@budibase/standard-components/heading")
    .normalStyle(headingStyle)
    .type("h1")
    .text("Screen Slot")
    .instanceName("Heading")
  const textScreenDisplay = new Component("@budibase/standard-components/text")
    .normalStyle(textStyle)
    .instanceName("Text")
    .type("none")
    .text(
      "The screens that you create will be displayed inside this box. This box is just a placeholder, to show you the position of screens."
    )
  const container = new Component("@budibase/standard-components/container")
    .normalStyle({
      display: "flex",
      "flex-direction": "column",
      "align-items": "center",
      flex: "1 1 auto",
    })
    .type("div")
    .instanceName("Container")
    .addChild(heading)
    .addChild(textScreenDisplay)
  const screenPlaceholder = new Screen()
    .name("Screen Placeholder")
    .route("*")
    .component("@budibase/standard-components/container")
    .mainType("div")
    .instanceName("Content Placeholder")
    .normalStyle({
      flex: "1 1 auto",
    })
    .addChild(container)
    .json()
  // TODO: this ID is attached to how the screen slot is rendered, confusing, would be better a type etc
  screenPlaceholder.props._id = "screenslot-placeholder"

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
