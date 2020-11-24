<script>
  import { onMount } from "svelte"
  import { store } from "builderStore"
  import iframeTemplate from "./iframeTemplate"
  import { Screen } from "builderStore/store/screenTemplates/utils/Screen"
  import { Component } from "builderStore/store/screenTemplates/utils/Component"

  let iframe

  // Styles for screenslot placeholder
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

  // Extract data to pass to the iframe
  $: page = $store.layouts[$store.currentPageName]
  $: screen =
    $store.currentFrontEndType === "page"
      ? screenPlaceholder
      : $store.currentPreviewItem
  $: selectedComponentId = $store.currentComponentInfo?._id ?? ""
  $: previewData = {
    page,
    screen,
    selectedComponentId,
  }

  // Update the iframe with the builder info to render the correct preview
  const refreshContent = () => {
    if (iframe) {
      iframe.contentWindow.postMessage(JSON.stringify(previewData))
    }
  }

  // Refrech the preview when required
  $: refreshContent(previewData)

  // Initialise the app when mounted
  onMount(() => {
    iframe.contentWindow.addEventListener("bb-ready", refreshContent, {
      once: true,
    })
  })
</script>

<div class="component-container">
  {#if $store.currentPreviewItem}
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
