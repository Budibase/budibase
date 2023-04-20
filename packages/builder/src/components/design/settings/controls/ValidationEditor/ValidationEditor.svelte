<script>
  import { _ } from "../../../../../../lang/i18n"
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

<ActionButton on:click={drawer.show}
  >{$_(
    "components.design.settings.controls.ValidationEditor.ValidationEditor.Configure_validation"
  )}</ActionButton
>
<Drawer
  bind:this={drawer}
  title={$_(
    "components.design.settings.controls.ValidationEditor.ValidationDrawer.Validation_Rules"
  )}
>
  <svelte:fragment slot="description">
    {$_(
      "components.design.settings.controls.ValidationEditor.ValidationDrawer.Configure_validation_rules"
    )}
  </svelte:fragment>
  <Button cta slot="buttons" on:click={save}
    >{$_(
      "components.design.settings.controls.ValidationEditor.ValidationDrawer.Save"
    )}</Button
  >
  <ValidationDrawer
    slot="body"
    bind:rules={value}
    {type}
    {bindings}
    {componentDefinition}
  />
</Drawer>
