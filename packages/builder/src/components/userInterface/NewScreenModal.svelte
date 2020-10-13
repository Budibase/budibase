<script>
  import { goto } from "@sveltech/routify"
  import { store, backendUiStore } from "builderStore"
  import { Input, Button, Spacer, Select, ModalContent } from "@budibase/bbui"
  import getTemplates from "builderStore/store/screenTemplates"
  import { some } from "lodash/fp"
  import analytics from "analytics"

  const CONTAINER = "@budibase/standard-components/container"

  let name = ""
  let routeError
  let baseComponent = CONTAINER
  let templateIndex
  let draftScreen

  $: templates = getTemplates($store, $backendUiStore.models)

  $: route = !route && $store.screens.length === 0 ? "*" : route

  $: baseComponents = Object.values($store.components)
    .filter(componentDefinition => componentDefinition.baseComponent)
    .map(c => c._component)

  $: {
    if (templates && templateIndex === undefined) {
      templateIndex = 0
      templateChanged(0)
    }
  }

  const templateChanged = newTemplateIndex => {
    if (newTemplateIndex === undefined) return
    const template = templates[newTemplateIndex]
    draftScreen = templates[newTemplateIndex].create()
    if (draftScreen.props._instanceName) {
      name = draftScreen.props._instanceName
    }

    if (draftScreen.props._component) {
      baseComponent = draftScreen.props._component
    }

    if (draftScreen.route) {
      route = draftScreen.route
    }
  }

  const save = () => {
    if (!route) {
      routeError = "Url is required"
    } else {
      if (routeNameExists(route)) {
        routeError = "This url is already taken"
      } else {
        routeError = ""
      }
    }

    if (routeError) return false

    draftScreen.props._instanceName = name
    draftScreen.props._component = baseComponent
    draftScreen.route = route

    store.createScreen(draftScreen)

    if (templateIndex !== undefined) {
      const template = templates[templateIndex]
      analytics.captureEvent("Screen Created", {
        template: template.id || template.name,
      })
    }

    $goto(`./:page/${name}`)
  }

  const routeNameExists = route => {
    return $store.screens.some(
      screen => screen.route.toLowerCase() === route.toLowerCase()
    )
  }

  const routeChanged = event => {
    if (!event.target.value.startsWith("/")) {
      route = "/" + event.target.value
    }
  }
</script>

<ModalContent title="New Screen" confirmText="Create Screen" onConfirm={save}>

  <Select
    label="Choose a Template"
    bind:value={templateIndex}
    secondary
    on:change={ev => templateChanged(ev.target.value)}>
    {#if templates}
      {#each templates as template, index}
        <option value={index}>{template.name}</option>
      {/each}
    {/if}
  </Select>

  <Input label="Name" bind:value={name} />

  <Input
    label="Url"
    error={routeError}
    bind:value={route}
    on:change={routeChanged} />

</ModalContent>
