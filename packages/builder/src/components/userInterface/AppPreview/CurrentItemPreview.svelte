<script>
  import { onMount } from "svelte"
  import { store } from "builderStore"
  import iframeTemplate from "./iframeTemplate"
  import { Screen } from "builderStore/store/screenTemplates/utils/Screen"

  let iframe

  // Create screen slot placeholder for use when a page is selected rather
  // than a screen
  const screenPlaceholder = new Screen()
    .name("Screen Placeholder")
    .route("*")
    .component("@budibase/standard-components/screenslotplaceholder")
    .instanceName("Content Placeholder")
    .json()

  // Extract data to pass to the iframe
  $: page = $store.pages[$store.currentPageName]
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

  // Refresh the preview when required
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
