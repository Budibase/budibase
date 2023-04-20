<script>
  import { _ } from "../../../../../../../../../../../lang/i18n"
  import {
    DetailSummary,
    ActionButton,
    Drawer,
    Button,
    notifications,
  } from "@budibase/bbui"
  import { store } from "builderStore"
  import ConditionalUIDrawer from "./ConditionalUIDrawer.svelte"

  export let componentInstance
  export let bindings

  let tempValue
  let drawer

  const openDrawer = () => {
    tempValue = JSON.parse(JSON.stringify(componentInstance?._conditions ?? []))
    drawer.show()
  }

  const save = async () => {
    try {
      await store.actions.components.updateConditions(tempValue)
    } catch (error) {
      notifications.error(
        $_(
          "pages.builder.app.application.design.screenId.components.componentId._components.settings.ConditionalUISection.Error_updating"
        )
      )
    }
    drawer.hide()
  }

  $: conditionCount = componentInstance?._conditions?.length
  $: conditionText = `${conditionCount || "No"} condition${
    conditionCount !== 1 ? "s" : ""
  } set`
</script>

<DetailSummary name={"Conditions"} collapsible={false}>
  <div class="conditionCount">{conditionText}</div>
  <div>
    <ActionButton on:click={openDrawer}
      >{$_(
        "pages.builder.app.application.design.screenId.components.componentId._components.settings.ConditionalUISection.Configure_conditions"
      )}</ActionButton
    >
  </div>
</DetailSummary>
<Drawer bind:this={drawer} title="Conditions">
  <svelte:fragment slot="description">
    {$_(
      "pages.builder.app.application.design.screenId.components.componentId._components.settings.ConditionalUISection.Show"
    )}
  </svelte:fragment>
  <Button cta slot="buttons" on:click={() => save()}
    >{$_(
      "pages.builder.app.application.design.screenId.components.componentId._components.settings.ConditionalUISection.Save"
    )}</Button
  >
  <ConditionalUIDrawer slot="body" bind:conditions={tempValue} {bindings} />
</Drawer>

<style>
  .conditionCount {
    font-weight: 600;
    margin-top: -5px;
  }
</style>
