<script>
  import { store, backendUiStore } from "builderStore"
  import { Input, Button, Spacer, Select, Modal } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"
  import { some } from "lodash/fp"

  const dispatch = createEventDispatcher()
  const CONTAINER = "@budibase/standard-components/container"

  export const show = () => {
    dialog.show()
  }

  const finished = () => {
    dialog.hide()
    template = undefined
  }

  let screens
  let name = ""
  let routeError
  let baseComponent = CONTAINER
  let dialog
  let template

  $: templates = getTemplates($store, $backendUiStore.models)

  $: route = !route && $store.screens.length === 0 ? "*" : route

  $: baseComponents = Object.values($store.components)
    .filter(componentDefinition => componentDefinition.baseComponent)
    .map(c => c._component)

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

    store.createScreen({
      screenName: name,
      route,
      baseComponent,
    })

    name = ""
    route = ""
    baseComponent = CONTAINER
    dispatch("finished")
  }

  const cancel = () => {
    dispatch("finished")
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

<Modal bind:this={dialog} minWidth="500px">

  <h2>New Screen</h2>
  <Spacer extraLarge />

  <div class="bb-margin-xl">
    <label>Choose a Template</label>
    <Select bind:value={template} secondary>
      <option value="">Choose an Option</option>
      <option value="none">No Template</option>
      {#if templates}
        {#each templates as template}
          <option value={template}>{template.name}</option>
        {/each}
      {/if}
    </Select>
  </div>
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
      <label>Screen Type</label>
      <Select bind:value={baseComponent} secondary>
        {#each baseComponents as component}
          <option value={component}>{componentShortName(component)}</option>
        {/each}
      </Select>
    </div>

  </div>

  <Spacer extraLarge />

  <div data-cy="create-screen-footer" class="modal-footer">
    <Button secondary medium on:click={cancel}>Cancel</Button>
    <Button blue medium on:click={save}>Create Screen</Button>
  </div>

</Modal>

<style>
  h2 {
    font-size: var(--font-size-xl);
    margin: 0;
    font-family: var(--font-sans);
    font-weight: 600;
  }

  .modal-footer {
    display: flex;
    justify-content: space-between;
  }
</style>
