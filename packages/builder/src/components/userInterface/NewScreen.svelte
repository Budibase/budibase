<script>
  import { store } from "builderStore"
  import PropsView from "./PropsView.svelte"
  import Textbox from "components/common/Textbox.svelte"
  import Button from "components/common/Button.svelte"
  import ActionButton from "components/common/ActionButton.svelte"
  import ButtonGroup from "components/common/ButtonGroup.svelte"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"
  import { pipe } from "components/common/core"
  import UIkit from "uikit"
  import { isRootComponent } from "./pagesParsing/searchComponents"
  import { splitName } from "./pagesParsing/splitRootComponentName.js"

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

    const isValid =
      name.length > 0 &&
      !screenNameExists(name) &&
      route.length > 0 &&
      !routeNameExists(route) &&
      layoutComponent

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

  <div class="uk-form-horizontal">
    <div class="uk-margin">
      <label class="uk-form-label">Name</label>
      <div class="uk-form-controls">
        <input
          class="uk-input uk-form-small"
          class:uk-form-danger={saveAttempted && (name.length === 0 || screenNameExists(name))}
          bind:value={name} />
      </div>
    </div>

    <div class="uk-margin">
      <label class="uk-form-label">Route (URL)</label>
      <div class="uk-form-controls">
        <input
          class="uk-input uk-form-small"
          class:uk-form-danger={saveAttempted && (route.length === 0 || routeNameExists(route))}
          bind:value={route}
          on:change={routeChanged} />
      </div>
    </div>

    <div class="uk-margin">
      <label class="uk-form-label">Layout Component</label>
      <div class="uk-form-controls">
        <select
          class="uk-select uk-form-small"
          bind:value={layoutComponent}
          class:uk-form-danger={saveAttempted && !layoutComponent}>
          {#each layoutComponents as { _component, name }}
            <option value={_component}>{name}</option>
          {/each}
        </select>
      </div>
    </div>
  </div>

</ConfirmDialog>

<style>
  .uk-margin {
    display: flex;
    flex-direction: column;
  }

  .uk-form-controls {
    margin-left: 0 !important;
  }

  .uk-form-label {
    padding-bottom: 10px;
    font-weight: 500;
    font-size: 16px;
    color: var(--secondary80);
  }

  .uk-input {
    height: 40px !important;
    border-radius: 3px;
  }

  .uk-select {
    height: 40px !important;
    font-weight: 500px;
    color: var(--secondary60);
    border: 1px solid var(--slate);
    border-radius: 3px;
  }
</style>
