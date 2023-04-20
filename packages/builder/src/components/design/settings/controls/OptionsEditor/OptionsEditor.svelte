<script>
  import { _ } from "../../../../../../lang/i18n"
  import { ActionButton, Button, Drawer } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"
  import OptionsDrawer from "./OptionsDrawer.svelte"

  const dispatch = createEventDispatcher()

  export let value

  let drawer
  let tempValue = value || []

  const saveOptions = async () => {
    // Filter out incomplete options, default if needed
    tempValue = tempValue.filter(option => option.value || option.label)
    for (let i = 0; i < tempValue.length; i++) {
      let option = tempValue[i]
      option.label = option.label ? option.label : option.value
      option.value = option.value ? option.value : option.label
      tempValue[i] = option
    }
    dispatch("change", tempValue)
    drawer.hide()
  }
</script>

<ActionButton on:click={drawer.show}
  >{$_(
    "components.design.settings.controls.OptionEditor.OptionsEditor.Define_Options"
  )}</ActionButton
>
<Drawer bind:this={drawer} title="Options">
  <svelte:fragment slot="description">
    {$_(
      "components.design.settings.controls.OptionEditor.OptionsEditor.Define_options"
    )}
  </svelte:fragment>
  <Button cta slot="buttons" on:click={saveOptions}
    >{$_(
      "components.design.settings.controls.OptionEditor.OptionsDrawer.Save"
    )}</Button
  >
  <OptionsDrawer bind:options={tempValue} slot="body" />
</Drawer>
