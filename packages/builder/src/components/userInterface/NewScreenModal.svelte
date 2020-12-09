<script>
  import { goto } from "@sveltech/routify"
  import { store, backendUiStore, allScreens } from "builderStore"
  import { Input, Select, ModalContent, Toggle } from "@budibase/bbui"
  import getTemplates from "builderStore/store/screenTemplates"
  import analytics from "analytics"
  import { onMount } from "svelte"
  import api from "builderStore/api"

  const CONTAINER = "@budibase/standard-components/container"

  let name = ""
  let routeError
  let baseComponent = CONTAINER
  let templateIndex
  let draftScreen
  let createLink = true
  let roleId = "BASIC"

  $: templates = getTemplates($store, $backendUiStore.tables)
  $: route = !route && $allScreens.length === 0 ? "*" : route
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

    if (draftScreen.routing) {
      route = draftScreen.routing.route
    }
  }

  const save = async () => {
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
    draftScreen.routing = { route, roleId }

    const createdScreen = await store.actions.screens.create(draftScreen)
    if (createLink) {
      await store.actions.components.links.save(route, name)
    }
    await store.actions.routing.fetch()

    if (templateIndex !== undefined) {
      const template = templates[templateIndex]
      analytics.captureEvent("Screen Created", {
        template: template.id || template.name,
      })
    }

    $goto(`./${createdScreen._id}`)
  }

  const routeNameExists = route => {
    return $allScreens.some(
      screen => screen.routing.route.toLowerCase() === route.toLowerCase()
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
  <Select label="Access" bind:value={roleId} secondary>
    {#each $backendUiStore as role}
      <option value={role._id}>{role.name}</option>
    {/each}
  </Select>
  <Toggle text="Create link in navigation bar" bind:checked={createLink} />
</ModalContent>
