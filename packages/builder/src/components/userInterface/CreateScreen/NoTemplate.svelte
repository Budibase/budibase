<script>
  import { store } from "builderStore"
  import { Input, Button, Spacer } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"
  import { some } from "lodash/fp"

  const dispatch = createEventDispatcher()

  let screens
  let name = ""
  let routeError

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

    store.createScreen({
      screenName: name,
      route,
    })

    name = ""
    route = ""
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
</script>

<h2>New Screen</h2>
<Spacer extraLarge />

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

</div>

<Spacer extraLarge />

<div data-cy="create-screen-footer" class="modal-footer">
  <Button secondary medium on:click={cancel}>Cancel</Button>
  <Button blue medium on:click={save}>Create Screen</Button>
</div>

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
