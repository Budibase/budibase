<script>
  import { store } from "builderStore"
  import { pipe } from "components/common/core"
  import { isRootComponent } from "./pagesParsing/searchComponents"
  import { splitName } from "./pagesParsing/splitRootComponentName.js"
  import { Input, Select, Button, Spacer, ModalContent } from "@budibase/bbui"
  import { find, filter, some, map, includes } from "lodash/fp"
  import { assign } from "lodash"

  let dialog
  let layoutComponents
  let layoutComponent
  let screens
  let name = ""
  let routeError

  $: layoutComponents = Object.values($store.components).filter(
    componentDefinition => componentDefinition.container
  )

  $: layoutComponent = layoutComponent
    ? layoutComponents.find(
        component => component._component === layoutComponent._component
      )
    : layoutComponents[0]

  $: route = !route && $store.screens.length === 0 ? "*" : route

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
    if (routeError) {
      return false
    }
    store.createScreen(name, route, layoutComponent._component)
    name = ""
    route = ""
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
  <Input label="Name" bind:value={name} />
  <Input
    label="Url"
    error={routeError}
    bind:value={route}
    on:change={routeChanged} />
  <Select label="Layout Component" bind:value={layoutComponent} secondary>
    {#each layoutComponents as { _component, name }}
      <option value={_component}>{name}</option>
    {/each}
  </Select>
</ModalContent>
