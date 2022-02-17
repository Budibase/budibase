<script>
  import { Button, ActionButton, Drawer } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"
  import NavigationDrawer from "./NavigationDrawer.svelte"
  import { cloneDeep } from "lodash/fp"

  export let value = []
  let drawer
  let links = cloneDeep(value || [])

  const dispatch = createEventDispatcher()
  const save = () => {
    dispatch("change", links)
    drawer.hide()
  }
</script>

<ActionButton on:click={drawer.show}>Configure links</ActionButton>
<Drawer bind:this={drawer} title={"Navigation Links"}>
  <svelte:fragment slot="description">
    Configure the links in your navigation bar.
  </svelte:fragment>
  <Button cta slot="buttons" on:click={save}>Save</Button>
  <NavigationDrawer slot="body" bind:links />
</Drawer>
