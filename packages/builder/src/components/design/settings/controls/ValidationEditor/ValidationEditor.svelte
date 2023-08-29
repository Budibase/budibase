<script>
  import { Button, ActionButton, Drawer } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"
  import ValidationDrawer from "./ValidationDrawer.svelte"

  export let value = []
  export let bindings = []
  export let componentInstance
  export let type
  const dispatch = createEventDispatcher()
  let drawer

  $: text = getText(value)

  const save = () => {
    dispatch("change", value)
    drawer.hide()
  }

  const getText = rules => {
    if (!rules?.length) {
      return "No rules set"
    } else {
      return `${rules.length} rule${rules.length === 1 ? "" : "s"} set`
    }
  }
</script>

<div class="validation-editor">
  <ActionButton on:click={drawer.show}>{text}</ActionButton>
</div>

<Drawer bind:this={drawer} title="Validation Rules" on:drawerHide on:drawerShow>
  <svelte:fragment slot="description">
    Configure validation rules for this field.
  </svelte:fragment>
  <Button cta slot="buttons" on:click={save}>Save</Button>
  <ValidationDrawer
    slot="body"
    bind:rules={value}
    {type}
    {bindings}
    fieldName={componentInstance?.field}
  />
</Drawer>

<style>
  .validation-editor :global(.spectrum-ActionButton) {
    width: 100%;
  }
</style>
