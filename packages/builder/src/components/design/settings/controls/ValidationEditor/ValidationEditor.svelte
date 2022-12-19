<script>
  import { Button, ActionButton, Drawer } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"
  import ValidationDrawer from "./ValidationDrawer.svelte"

  export let value = []
  export let bindings = []
  export let componentDefinition
  export let type

  let drawer

  const dispatch = createEventDispatcher()
  const save = () => {
    dispatch("change", value)
    drawer.hide()
  }
</script>

<ActionButton on:click={drawer.show}>Configure validation</ActionButton>
<Drawer bind:this={drawer} title="Validation Rules">
  <svelte:fragment slot="description">
    Configure validation rules for this field.
  </svelte:fragment>
  <Button cta slot="buttons" on:click={save}>Save</Button>
  <ValidationDrawer
    slot="body"
    bind:rules={value}
    {type}
    {bindings}
    {componentDefinition}
  />
</Drawer>
