<script>
  import { Drawer, Button, Icon } from "@budibase/bbui"
  import CellDrawer from "./CellDrawer.svelte"

  export let column

  let boundValue
  let drawer

  $: updateBoundValue(column)

  const updateBoundValue = value => {
    boundValue = { ...value }
  }

  const open = () => {
    updateBoundValue(column)
    drawer.show()
  }

  const save = () => {
    column = boundValue
    drawer.hide()
  }
</script>

<Icon name="Settings" hoverable size="S" on:click={open} />
<Drawer bind:this={drawer} title={column.name}>
  <svelte:fragment slot="description">
    "{column.name}" column settings
  </svelte:fragment>
  <Button cta slot="buttons" on:click={save}>Save</Button>
  <CellDrawer slot="body" bind:column={boundValue} />
</Drawer>
