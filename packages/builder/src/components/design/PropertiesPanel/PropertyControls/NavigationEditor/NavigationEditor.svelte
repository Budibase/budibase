<script>
  import { Button, Drawer } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"
  import NavigationDrawer from "./NavigationDrawer.svelte"

  export let value = []
  let drawer

  const dispatch = createEventDispatcher()
  const save = () => {
    dispatch("change", value)
    drawer.hide()
  }
</script>

<Button secondary on:click={drawer.show}>Configure Links</Button>
<Drawer bind:this={drawer} title={"Navigation Links"}>
  <svelte:fragment slot="description">
    Configure the links in your navigation bar.
  </svelte:fragment>
  <Button cta slot="buttons" on:click={save}>Save</Button>
  <NavigationDrawer slot="body" bind:links={value} />
</Drawer>
