<script>
  import { get } from "svelte/store"
  import { onMount, onDestroy } from "svelte"
  import { store, currentAsset } from "builderStore"
  import iframeTemplate from "./iframeTemplate"
  import { Screen } from "builderStore/store/screenTemplates/utils/Screen"
  import { FrontendTypes } from "constants"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"
  import {
    ProgressCircle,
    Layout,
    Heading,
    Body,
    notifications,
  } from "@budibase/bbui"
  import ErrorSVG from "@budibase/frontend-core/assets/error.svg?raw"
  import { findComponent, findComponentPath } from "builderStore/componentUtils"

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

  // Messages that can be sent from the iframe preview to the builder
  // Budibase events are and initalisation events
  const MessageTypes = {
    READY: "ready",
    ERROR: "error",
    BUDIBASE: "type",
  }

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
    messagePassing: $store.clientFeatures.messagePassing,
    isBudibaseEvent: true,
    usedPlugins: $store.usedPlugins,
    location: window.location,
  }
  $: json = JSON.stringify(previewData)


  // Update the iframe with the builder info to render the correct preview
  const refreshContent = message => {
    if (iframe) {
      iframe.contentWindow.postMessage(message)
    }
  }

  // Refresh the preview when required
  $: refreshContent(json)

  function receiveMessage(message) {
    const handlers = {
      [MessageTypes.READY]: () => {
        // Initialise the app when mounted
        if ($store.clientFeatures.messagePassing) {
          if (!loading) return
        }

        // Display preview immediately if the intelligent loading feature
        // is not supported
        if (!$store.clientFeatures.intelligentLoading) {
          loading = false
        }
        refreshContent(json)
      },
      [MessageTypes.ERROR]: event => {
        // Catch any app errors
        loading = false
        error = event.error || "An unknown error occurred"
      },
    }

    const messageHandler = handlers[message.data.type] || handleBudibaseEvent
    messageHandler(message)
  }

  onMount(() => {
    window.addEventListener("message", receiveMessage)
    if (!$store.clientFeatures.messagePassing) {
      // Legacy - remove in later versions of BB
      iframe.contentWindow.addEventListener(
        "ready",
        () => {
          receiveMessage({ data: { type: MessageTypes.READY } })
        },
        { once: true }
      )
      iframe.contentWindow.addEventListener(
        "error",
        event => {
          receiveMessage({
            data: { type: MessageTypes.ERROR, error: event.detail },
          })
        },
        { once: true }
      )
      // Add listener for events sent by client library in preview
      iframe.contentWindow.addEventListener("bb-event", handleBudibaseEvent)
    }
  })

  // Remove all iframe event listeners on component destroy
  onDestroy(() => {
    window.removeEventListener("message", receiveMessage)

    if (iframe.contentWindow) {
      if (!$store.clientFeatures.messagePassing) {
        // Legacy - remove in later versions of BB
        iframe.contentWindow.removeEventListener(
          "bb-event",
          handleBudibaseEvent
        )
      }
    }
  })

  const handleBudibaseEvent = async event => {
    const { type, data } = event.data || event.detail
    if (!type) {
      return
    }

    try {
      if (type === "select-component" && data.id) {
        store.actions.components.select({ _id: data.id })
      } else if (type === "update-prop") {
        await store.actions.components.updateProp(data.prop, data.value)
      } else if (type === "delete-component" && data.id) {
        confirmDeleteComponent(data.id)
      } else if (type === "duplicate-component" && data.id) {
        const rootComponent = get(currentAsset).props
        const component = findComponent(rootComponent, data.id)
        store.actions.components.copy(component)
        await store.actions.components.paste(component)
      } else if (type === "preview-loaded") {
        // Wait for this event to show the client library if intelligent
        // loading is supported
        loading = false
      } else if (type === "move-component") {
        const { componentId, destinationComponentId } = data
        const rootComponent = get(currentAsset).props

        // Get source and destination components
        const source = findComponent(rootComponent, componentId)
        const destination = findComponent(rootComponent, destinationComponentId)

        // Stop if the target is a child of source
        const path = findComponentPath(source, destinationComponentId)
        const ids = path.map(component => component._id)
        if (ids.includes(data.destinationComponentId)) {
          return
        }

        // Cut and paste the component to the new destination
        if (source && destination) {
          store.actions.components.copy(source, true)
          await store.actions.components.paste(destination, data.mode)
        }
      } else if (type === "reload-plugin") {
        await store.actions.components.refreshDefinitions()
      } else {
        console.warn(`Client sent unknown event type: ${type}`)
      }
    } catch (error) {
      console.warn(error)
      notifications.error("Error handling event from app preview")
    }
  }

  const confirmDeleteComponent = componentId => {
    idToDelete = componentId
    confirmDeleteDialog.show()
  }

  const deleteComponent = async () => {
    try {
      await store.actions.components.delete({ _id: idToDelete })
    } catch (error) {
      notifications.error("Error deleting component")
    }
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
