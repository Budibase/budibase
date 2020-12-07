<script>
  import { onMount } from "svelte"
  import { store, currentAsset } from "builderStore"
  import iframeTemplate from "./iframeTemplate"
  import { Screen } from "builderStore/store/screenTemplates/utils/Screen"
  import { FrontendTypes } from "../../../constants"

  let iframe
  let layout
  let screen

  // Create screen slot placeholder for use when a page is selected rather
  // than a screen
  const screenPlaceholder = new Screen()
    .name("Screen Placeholder")
    .route("*")
    .component("@budibase/standard-components/screenslotplaceholder")
    .instanceName("Content Placeholder")
    .json()

  // Extract data to pass to the iframe
  $: {
    if ($store.currentFrontEndType === FrontendTypes.LAYOUT) {
      layout = $currentAsset
      screen = screenPlaceholder
    } else {
      screen = $currentAsset
      layout = $store.layouts.find(layout => layout._id === screen?.layoutId)
    }
  }
  $: selectedComponentId = $store.selectedComponentId ?? ""
  $: previewData = {
    layout,
    screen,
    selectedComponentId,
  }

  // Saving pages and screens to the DB causes them to have _revs.
  // These revisions change every time a save happens and causes
  // these reactive statements to fire, even though the actual
  // definition hasn't changed.
  // By deleting all _rev properties we can avoid this and increase
  // performance.
  $: json = JSON.stringify(previewData)
  $: strippedJson = json.replaceAll(/"_rev":\s*"[^"]+"/g, `"_rev":""`)

  // Update the iframe with the builder info to render the correct preview
  const refreshContent = message => {
    if (iframe) {
      iframe.contentWindow.postMessage(message)
    }
  }

  // Refresh the preview when required
  $: refreshContent(strippedJson)

  // Initialise the app when mounted
  onMount(() => {
    iframe.contentWindow.addEventListener(
      "bb-ready",
      () => {
        refreshContent(strippedJson)
      },
      {
        once: true,
      }
    )
  })
</script>

<div class="component-container">
  {#if $currentAsset}
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
