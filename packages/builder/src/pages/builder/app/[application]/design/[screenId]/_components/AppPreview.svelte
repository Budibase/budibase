<script>
  import { get } from "svelte/store"
  import { onMount, onDestroy } from "svelte"
  import { store, selectedScreen, currentAsset } from "builderStore"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"
  import {
    ProgressCircle,
    Layout,
    Heading,
    Body,
    Icon,
    notifications,
  } from "@budibase/bbui"
  import ErrorSVG from "@budibase/frontend-core/assets/error.svg?raw"
  import { findComponent, findComponentPath } from "builderStore/componentUtils"
  import { isActive, goto } from "@roxi/routify"

  let iframe
  let layout
  let screen
  let confirmDeleteDialog
  let idToDelete
  let loading = true
  let error

  // Messages that can be sent from the iframe preview to the builder
  // Budibase events are and initialisation events
  const MessageTypes = {
    READY: "ready",
    ERROR: "error",
    BUDIBASE: "type",
  }

  // Extract data to pass to the iframe
  $: screen = $selectedScreen

  // Determine selected component ID
  $: selectedComponentId = $store.selectedComponentId

  $: previewData = {
    appId: $store.appId,
    layout,
    screen,
    selectedComponentId,
    theme: $store.theme,
    customTheme: $store.customTheme,
    previewDevice: $store.previewDevice,
    messagePassing: $store.clientFeatures.messagePassing,
    navigation: $store.navigation,
    hiddenComponentIds:
      $store.componentToPaste?._id && $store.componentToPaste?.isCut
        ? [$store.componentToPaste?._id]
        : [],
    isBudibaseEvent: true,
    usedPlugins: $store.usedPlugins,
    location: {
      protocol: window.location.protocol,
      hostname: window.location.hostname,
      port: window.location.port,
    },
  }

  // Refresh the preview when required
  $: json = JSON.stringify(previewData)
  $: refreshContent(json)

  // Determine if the add component menu is active
  $: isAddingComponent = $isActive(`./${selectedComponentId}/new`)

  // Register handler to send custom to the preview
  $: sendPreviewEvent = (name, payload) => {
    iframe?.contentWindow.postMessage(
      JSON.stringify({
        name,
        payload,
        isBudibaseEvent: true,
        runtimeEvent: true,
      })
    )
  }
  $: store.actions.preview.registerEventHandler(sendPreviewEvent)

  // Update the iframe with the builder info to render the correct preview
  const refreshContent = message => {
    iframe?.contentWindow.postMessage(message)
  }

  const receiveMessage = async message => {
    if (!message?.data?.type) {
      return
    }

    // Await the event handler
    try {
      await handleBudibaseEvent(message)
    } catch (error) {
      notifications.error(error || "Error handling event from app preview")
    }

    // Reply that the event has been completed
    if (message.data?.id) {
      sendPreviewEvent("event-completed", message.data?.id)
    }
  }

  const handleBudibaseEvent = async event => {
    const { type, data } = event.data
    if (type === MessageTypes.READY) {
      // Initialise the app when mounted
      if (!loading) {
        return
      }
      refreshContent(json)
    } else if (type === MessageTypes.ERROR) {
      // Catch any app errors
      loading = false
      error = event.error || "An unknown error occurred"
    } else if (type === "select-component" && data.id) {
      $store.selectedComponentId = data.id
    } else if (type === "update-prop") {
      await store.actions.components.updateSetting(data.prop, data.value)
    } else if (type === "update-styles") {
      await store.actions.components.updateStyles(data.styles, data.id)
    } else if (type === "delete-component" && data.id) {
      // Legacy type, can be deleted in future
      confirmDeleteComponent(data.id)
    } else if (type === "key-down") {
      const { key, ctrlKey } = data
      document.dispatchEvent(new KeyboardEvent("keydown", { key, ctrlKey }))
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
        store.actions.components.copy(source, true, false)
        await store.actions.components.paste(destination, data.mode)
      }
    } else if (type === "request-add-component") {
      toggleAddComponent()
    } else if (type === "highlight-setting") {
      store.actions.settings.highlight(data.setting)

      // Also scroll setting into view
      const selector = `#${data.setting}-prop-control`
      const element = document.querySelector(selector)?.parentElement
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "center",
        })
      }
    } else if (type === "eject-block") {
      const { id, definition } = data
      await store.actions.components.handleEjectBlock(id, definition)
    } else if (type === "reload-plugin") {
      await store.actions.components.refreshDefinitions()
    } else if (type === "drop-new-component") {
      const { component, parent, index } = data
      await store.actions.components.create(component, null, parent, index)
    } else if (type === "add-parent-component") {
      const { componentId, parentType } = data
      await store.actions.components.addParent(componentId, parentType)
    } else {
      console.warn(`Client sent unknown event type: ${type}`)
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

  const toggleAddComponent = () => {
    if ($isActive(`./:componentId/new`)) {
      $goto(`./:componentId`)
    } else {
      $goto(`./:componentId/new`)
    }
  }

  onMount(() => {
    window.addEventListener("message", receiveMessage)
  })

  onDestroy(() => {
    window.removeEventListener("message", receiveMessage)
  })
</script>

<div class="component-container">
  {#if loading}
    <div class="center">
      <ProgressCircle />
    </div>
  {:else if error}
    <div class="center error">
      <Layout justifyItems="center" gap="S">
        <!-- eslint-disable-next-line svelte/no-at-html-tags -->
        {@html ErrorSVG}
        <Heading size="L">App preview failed to load</Heading>
        <Body size="S">{error}</Body>
      </Layout>
    </div>
  {/if}
  <iframe
    title="componentPreview"
    bind:this={iframe}
    src="/app/preview"
    class:hidden={loading || error}
    class:tablet={$store.previewDevice === "tablet"}
    class:mobile={$store.previewDevice === "mobile"}
  />
  <div
    class="add-component"
    class:active={isAddingComponent}
    on:click={toggleAddComponent}
  >
    <Icon size="XL" name="Add">Component</Icon>
  </div>
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

  .add-component {
    position: absolute;
    bottom: 20px;
    right: 20px;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: var(--spectrum-global-color-blue-500);
    display: grid;
    place-items: center;
    color: white;
    box-shadow: 1px 3px 8px 0 rgba(0, 0, 0, 0.3);
    cursor: pointer;
    transition: transform ease-out 300ms, background ease-out 130ms;
  }
  .add-component:hover {
    background: var(--spectrum-global-color-blue-600);
  }
  .add-component.active {
    transform: rotate(-45deg);
  }
</style>
