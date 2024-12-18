<script>
  import { get } from "svelte/store"
  import { onMount, onDestroy } from "svelte"
  import {
    previewStore,
    builderStore,
    themeStore,
    componentStore,
    appStore,
    navigationStore,
    selectedScreen,
    hoverStore,
    componentTreeNodesStore,
    snippets,
  } from "@/stores/builder"
  import ConfirmDialog from "@/components/common/ConfirmDialog.svelte"
  import { Layout, Heading, Body, Icon, notifications } from "@budibase/bbui"
  import ErrorSVG from "@budibase/frontend-core/assets/error.svg?raw"
  import { findComponent, findComponentPath } from "@/helpers/components"
  import { isActive, goto } from "@roxi/routify"
  import { ClientAppSkeleton } from "@budibase/frontend-core"
  import { getThemeClassNames, ThemeClassPrefix } from "@budibase/shared-core"

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
  $: selectedComponentId = $componentStore.selectedComponentId

  $: previewData = {
    appId: $appStore.appId,
    layout,
    screen,
    selectedComponentId,
    theme: $appStore.clientFeatures.unifiedThemes
      ? $themeStore.theme
      : `${ThemeClassPrefix}${$themeStore.theme}`,
    customTheme: $themeStore.customTheme,
    previewDevice: $previewStore.previewDevice,
    messagePassing: $appStore.clientFeatures.messagePassing,
    navigation: $navigationStore,
    hiddenComponentIds:
      $componentStore.componentToPaste?._id &&
      $componentStore.componentToPaste?.isCut
        ? [$componentStore.componentToPaste?._id]
        : [],
    isBudibaseEvent: true,
    usedPlugins: $appStore.usedPlugins,
    location: {
      protocol: window.location.protocol,
      hostname: window.location.hostname,
      port: window.location.port,
    },
    snippets: $snippets,
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

  $: previewStore.registerEventHandler((name, payload) => {
    return sendPreviewEvent(name, payload)
  })

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
      componentStore.select(data.id)
      componentTreeNodesStore.makeNodeVisible(data.id)
    } else if (type === "hover-component") {
      hoverStore.hover(data.id, false)
    } else if (type === "update-prop") {
      await componentStore.updateSetting(data.prop, data.value)
    } else if (type === "update-styles") {
      await componentStore.updateStyles(data.styles, data.id)
    } else if (type === "delete-component" && data.id) {
      // Legacy type, can be deleted in future
      confirmDeleteComponent(data.id)
    } else if (type === "key-down") {
      const { key, ctrlKey } = data
      document.dispatchEvent(new KeyboardEvent("keydown", { key, ctrlKey }))
    } else if (type === "duplicate-component" && data.id) {
      const rootComponent = get(selectedScreen).props
      const component = findComponent(rootComponent, data.id)
      componentStore.copy(component)
      await componentStore.paste(
        component,
        data.mode,
        null,
        data.selectComponent
      )
    } else if (type === "preview-loaded") {
      // Wait for this event to show the client library if intelligent
      // loading is supported
      loading = false
    } else if (type === "move-component") {
      const { componentId, destinationComponentId } = data
      const rootComponent = get(selectedScreen).props

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
        componentStore.copy(source, true, false)
        await componentStore.paste(destination, data.mode)
      }
    } else if (type === "request-add-component") {
      toggleAddComponent()
    } else if (type === "highlight-setting") {
      builderStore.highlightSetting(data.setting, "error")

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
      await componentStore.handleEjectBlock(id, definition)
    } else if (type === "reload-plugin") {
      await componentStore.refreshDefinitions()
    } else if (type === "drop-new-component") {
      const { component, parent, index } = data
      await componentStore.create(component, null, parent, index)
    } else if (type === "add-parent-component") {
      const { componentId, parentType } = data
      await componentStore.addParent(componentId, parentType)
    } else if (type === "provide-context") {
      let context = data?.context
      if (context) {
        try {
          context = JSON.parse(context)
        } catch (error) {
          context = null
        }
      }
      previewStore.setSelectedComponentContext(context)
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
      await componentStore.delete({ _id: idToDelete })
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

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
  class="component-container"
  class:tablet={$previewStore.previewDevice === "tablet"}
  class:mobile={$previewStore.previewDevice === "mobile"}
>
  {#if loading}
    <div class={`loading ${getThemeClassNames($themeStore.theme)}`}>
      <ClientAppSkeleton
        sideNav={$navigationStore?.navigation === "Left"}
        hideFooter
        hideDevTools
      />
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
  />
  <div class="underlay" />
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
    display: grid;
    place-items: center;
    position: relative;
    margin: auto;
    height: 100%;
    --client-padding: 6px;
  }
  .component-container iframe {
    border: 0;
    left: 0;
    top: 0;
    width: 100%;
    background-color: transparent;
  }

  .loading,
  .underlay {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
    width: calc(100% - var(--client-padding) * 2);
    height: calc(100% - var(--client-padding) * 2);
  }
  .tablet .loading,
  .tablet .underlay {
    max-width: 1024px;
    max-height: 768px;
  }
  .mobile .loading,
  .mobile .underlay {
    max-width: 390px;
    max-height: 844px;
  }

  .underlay {
    background: var(--spectrum-global-color-gray-200);
    z-index: -1;
    padding: 2px;
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
