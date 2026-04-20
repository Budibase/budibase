<script lang="ts">
  import { Drawer, Button, Icon } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"
  import CellDrawer from "./CellDrawer.svelte"
  import type { ColumnConfig } from "./types"

  export let column: ColumnConfig

  const dispatch = createEventDispatcher<{ change: ColumnConfig }>()

  let boundValue: ColumnConfig
  let drawer: Drawer

  $: updateBoundValue(column)

  const updateBoundValue = (value: ColumnConfig) => {
    boundValue = { ...value }
  }

  const open = () => {
    updateBoundValue(column)
    drawer.show()
  }

  const save = () => {
    dispatch("change", boundValue)
    drawer.hide()
  }
</script>

<Icon name="gear" hoverable size="S" on:click={open} />
<Drawer bind:this={drawer} title={column.name}>
  <Button cta slot="buttons" on:click={save}>Save</Button>
  <CellDrawer slot="body" column={boundValue} />
</Drawer>
