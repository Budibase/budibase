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
  let nameError = ""
  let routeError

  let saveAttempted = false

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
    saveAttempted = true

    if (name.length === 0) {
      nameError = "Name is required"
    } else {
      if (screenNameExists(name)) {
        nameError = "This name is already taken"
      } else {
        nameError = ""
      }
    }

    if (route.length === 0) {
      routeError = "Url is required"
    } else {
      if (routeNameExists(name)) {
        routeError = "This url is already taken"
      } else {
        routeError = ""
      }
    }

    const isValid = !routeError && !nameError

    if (!isValid) return

    store.createScreen(name, route, layoutComponent._component)
    dialog.hide()
  }

  const cancel = () => {
    dialog.hide()
  }

  const screenNameExists = name => {
    return $store.screens.some(
      screen => screen.name.toLowerCase() === name.toLowerCase()
    )
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

  <div>
    <div class="uk-margin">
      <Input label="Name" error={nameError} bind:value={name} />
    </div>

    <div class="uk-margin">
      <Input
        label="Url"
        error={routeError}
        bind:value={route}
        on:change={routeChanged} />
    </div>

    <div class="uk-margin">
      <label>Layout Component</label>
      <Select bind:value={layoutComponent}>
        {#each layoutComponents as { _component, name }}
          <option value={_component}>{name}</option>
        {/each}
      </Select>
    </div>
  </div>

</ConfirmDialog>

<style>
  .uk-margin {
    display: flex;
    flex-direction: column;
  }
</style>
