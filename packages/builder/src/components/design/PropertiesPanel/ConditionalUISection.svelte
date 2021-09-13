<script>
  import { DetailSummary, ActionButton, Drawer, Button } from "@budibase/bbui"
  import { store } from "builderStore"
  import ConditionalUIDrawer from "./PropertyControls/ConditionalUIDrawer.svelte"
  import { _ as t } from "svelte-i18n"

  export let componentInstance
  export let bindings

  let tempValue
  let drawer

  const openDrawer = () => {
    tempValue = JSON.parse(JSON.stringify(componentInstance?._conditions ?? []))
    drawer.show()
  }

  const save = () => {
    store.actions.components.updateConditions(tempValue)
    drawer.hide()
  }
</script>

<DetailSummary
  name={`${$t("conditions")}${componentInstance?._conditions ? " *" : ""}`}
  collapsible={false}
>
  <div>
    <ActionButton on:click={openDrawer}
      >{$t("configure-conditions")}</ActionButton
    >
  </div>
</DetailSummary>
<Drawer bind:this={drawer} title={$t("conditions")} cancelText={$t("cancel")}>
  <svelte:fragment slot="description">
    {$t("show-hide-and-update-components-in-response-to-conditions-being-met")}
  </svelte:fragment>
  <Button cta slot="buttons" on:click={() => save()}>{$t("save")}</Button>
  <ConditionalUIDrawer slot="body" bind:conditions={tempValue} {bindings} />
</Drawer>
