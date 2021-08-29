<script>
  import { Button, ActionButton, Drawer } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"
  import ValidationDrawer from "./ValidationDrawer.svelte"
  import { _ as t } from "svelte-i18n"

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

<ActionButton on:click={drawer.show}>{ $t('configure-validation') }</ActionButton>
<Drawer bind:this={drawer} title={ $t('validation-rules') }>
  <svelte:fragment slot="description">
    {$t("configure-validation-rules-for-this-field")}
  </svelte:fragment>
  <Button cta slot="buttons" on:click={save}>{$t("save")}</Button>
  <ValidationDrawer
    slot="body"
    bind:rules={value}
    {type}
    {bindings}
    {componentDefinition}
  />
</Drawer>
