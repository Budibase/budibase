<script>
  import { store } from "builderStore"
  import Button from "components/common/Button.svelte"
  import ActionButton from "components/common/ActionButton.svelte"
  import ButtonGroup from "components/common/ButtonGroup.svelte"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"
  import { pipe } from "components/common/core"
  import UIkit from "uikit"
  import { isRootComponent } from "./pagesParsing/searchComponents"
  import { splitName } from "./pagesParsing/splitRootComponentName.js"
  import { Input, Select } from "@budibase/bbui"

  import { find, filter, some, map, includes } from "lodash/fp"
  import { assign } from "lodash"

  export const show = () => {
    dialog.show()
  }

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

    if (routeError) return false

    store.createScreen(name, route, layoutComponent._component)
    name = ""
    route = ""
    dialog.hide()
  }

  const cancel = () => {
    dialog.hide()
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

<ConfirmDialog
  bind:this={dialog}
  title="New Screen"
  onCancel={cancel}
  onOk={save}
  okText="Create Screen">

  <div data-cy="new-screen-dialog">
    <div class="bb-margin-xl">
      <Input label="Name" bind:value={name} />
    </div>

    <div class="bb-margin-xl">
      <Input
        label="Url"
        error={routeError}
        bind:value={route}
        on:change={routeChanged} />
    </div>

    <div class="bb-margin-xl">
      <label>Layout Component</label>
      <Select bind:value={layoutComponent} secondary>
        {#each layoutComponents as { _component, name }}
          <option value={_component}>{name}</option>
        {/each}
      </Select>
    </div>
  </div>

</ConfirmDialog>
