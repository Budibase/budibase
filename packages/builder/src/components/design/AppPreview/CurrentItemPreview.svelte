<script>
  import { onMount, onDestroy } from "svelte"
  import { store, currentAsset } from "builderStore"
  import iframeTemplate from "./iframeTemplate"
  import { Screen } from "builderStore/store/screenTemplates/utils/Screen"
  import { FrontendTypes } from "constants"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"
  import { ProgressCircle, Layout, Heading, Body } from "@budibase/bbui"
  import ErrorSVG from "assets/error.svg?raw"

  let iframe
  let layout
  let screen
  let confirmDeleteDialog
  let idToDelete
  let loading = true
  let error

  // Create screen slot placeholder for use when a page is selected rather
  // than a screen
  const screenPlaceholder = new Screen()
    .name("Screen Placeholder")
    .route("*")
    .component("@budibase/standard-components/screenslot")
    .instanceName("Content Placeholder")
    .json()

  // Construct iframe template
  $: template = iframeTemplate.replace(
    /\{\{ CLIENT_LIB_PATH }}/,
    $store.clientLibPath
  )

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
    appId: $store.appId,
    layout,
    screen,
    selectedComponentId,
    previewType: $store.currentFrontEndType,
    theme: $store.theme,
    customTheme: $store.customTheme,
    previewDevice: $store.previewDevice,
  }

  // Saving pages and screens to the DB causes them to have _revs.
  // These revisions change every time a save happens and causes
  // these reactive statements to fire, even though the actual
  // definition hasn't changed.
  // By deleting all _rev properties we can avoid this and increase
  // performance.
  $: json = JSON.stringify(previewData)
  $: strippedJson = json.replace(/"_rev":\s*"[^"]+"/g, `"_rev":""`)

  // Update the iframe with the builder info to render the correct preview
  const refreshContent = message => {
    if (iframe) {
      iframe.contentWindow.postMessage(message)
    }
  }

  // Refresh the preview when required
  $: refreshContent(strippedJson)

  onMount(() => {
    // Initialise the app when mounted
    iframe.contentWindow.addEventListener(
      "ready",
      () => {
        // Display preview immediately if the intelligent loading feature
        // is not supported
        if (!$store.clientFeatures.intelligentLoading) {
          loading = false
        }
        refreshContent(strippedJson)
      },
      { once: true }
    )

    // Catch any app errors
    iframe.contentWindow.addEventListener(
      "error",
      event => {
        loading = false
        error = event.detail || "An unknown error occurred"
      },
      { once: true }
    )

    // Add listener for events sent by client library in preview
    iframe.contentWindow.addEventListener("bb-event", handleBudibaseEvent)
    iframe.contentWindow.addEventListener("keydown", handleKeydownEvent)
  })

  // remove all iframe event listeners on component destroy
  onDestroy(() => {
    if (iframe.contentWindow) {
      iframe.contentWindow.removeEventListener("bb-event", handleBudibaseEvent)
      iframe.contentWindow.removeEventListener("keydown", handleKeydownEvent)
    }
  })

  const handleBudibaseEvent = event => {
    const { type, data } = event.detail
    if (type === "select-component" && data.id) {
      store.actions.components.select({ _id: data.id })
    } else if (type === "update-prop") {
      store.actions.components.updateProp(data.prop, data.value)
    } else if (type === "delete-component" && data.id) {
      confirmDeleteComponent(data.id)
    } else if (type === "preview-loaded") {
      // Wait for this event to show the client library if intelligent
      // loading is supported
      loading = false
    } else {
      console.warning(`Client sent unknown event type: ${type}`)
    }
  }

  const handleKeydownEvent = event => {
    if (
      (event.key === "Delete" || event.key === "Backspace") &&
      selectedComponentId &&
      ["input", "textarea"].indexOf(
        iframe.contentWindow.document.activeElement?.tagName.toLowerCase()
      ) === -1
    ) {
      confirmDeleteComponent(selectedComponentId)
    }
  }

  const confirmDeleteComponent = componentId => {
    idToDelete = componentId
    confirmDeleteDialog.show()
  }

  const deleteComponent = () => {
    store.actions.components.delete({ _id: idToDelete })
    idToDelete = null
  }
  const cancelDeleteComponent = () => {
    idToDelete = null
  }
</script>

<div class="component-container">
  {#if loading}
    <div class="center">
      <ProgressCircle />
    </div>
  {:else if error}
    <div class="center error">
      <Layout justifyItems="center" gap="S">
        {@html ErrorSVG}
        <Heading size="L">App preview failed to load</Heading>
        <Body size="S">{error}</Body>
      </Layout>
    </div>
  {/if}
  <iframe
    title="componentPreview"
    bind:this={iframe}
    srcdoc={template}
    class:hidden={loading || error}
    class:tablet={$store.previewDevice === "tablet"}
    class:mobile={$store.previewDevice === "mobile"}
  />
</div>
<ConfirmDialog
  bind:this={confirmDeleteDialog}
  title="Confirm Deletion"
  body={`Are you sure you want to delete this component?`}
  okText="Delete component"
  onOk={deleteComponent}
  onCancel={cancelDeleteComponent}
/>

<style>
  .component-container {
    grid-row-start: middle;
    grid-column-start: middle;
    display: grid;
    place-items: center;
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
    background-color: transparent;
  }
  .center {
    position: absolute;
    width: 100%;
    height: 100%;
    display: grid;
    place-items: center;
    z-index: 1;
  }
  .hidden {
    opacity: 0;
  }
  .error :global(svg) {
    fill: var(--spectrum-global-color-gray-500);
    width: 80px;
    height: 80px;
  }
  .error :global(h1),
  .error :global(p) {
    color: var(--spectrum-global-color-gray-800);
  }
  .error :global(p) {
    font-style: italic;
    margin-top: -0.5em;
  }
  .error :global(h1) {
    font-weight: 400;
    margin: 0;
  }

  iframe {
    width: 100%;
    height: 100%;
  }
</style>
