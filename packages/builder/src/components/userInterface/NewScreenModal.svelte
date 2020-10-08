<script>
  import { store, backendUiStore } from "builderStore"
  import { Input, Button, Spacer, Select, ModalContent } from "@budibase/bbui"
  import getTemplates from "builderStore/store/screenTemplates"
  import { some } from "lodash/fp"

  const CONTAINER = "@budibase/standard-components/container"

  let name = ""
  let routeError
  let baseComponent = CONTAINER
  let templateIndex = 0
  let draftScreen

  $: templates = getTemplates($store, $backendUiStore.models)

  $: route = !route && $store.screens.length === 0 ? "*" : route

  $: baseComponents = Object.values($store.components)
    .filter(componentDefinition => componentDefinition.baseComponent)
    .map(c => c._component)

  const templateChanged = ev => {
    const newTemplateIndex = ev.target.value
    if (!newTemplateIndex) return

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

    finished()
  }

  const finished = () => {
    templateIndex = 0
    name = ""
    route = ""
    baseComponent = CONTAINER
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

  const componentShortName = fullname => {
    const parts = fullname.split("/")
    const shortName = parts[parts.length - 1]
    // make known ones a bit prettier
    if (shortName === "container") return "Container"
    if (shortName === "recorddetail") return "Record Detail"
    if (shortName === "newrecord") return "New Record"
    return shortName
  }
</script>

<ModalContent title="New Screen" confirmText="Create Screen" onConfirm={save}>

  <Select
    label="Choose a Template"
    bind:value={templateIndex}
    secondary
    on:change={templateChanged}>
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

  <Select label="Screen Type" bind:value={baseComponent} secondary>
    {#each baseComponents as component}
      <option value={component}>{componentShortName(component)}</option>
    {/each}
  </Select>

</ModalContent>
