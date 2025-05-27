<script>
  import {
    DetailSummary,
    ActionButton,
    Drawer,
    Button,
    notifications,
  } from "@budibase/bbui"
  import { componentStore } from "@/stores/builder"
  import ConditionalUIDrawer from "./ConditionalUIDrawer.svelte"
  import ComponentSettingsSection from "./ComponentSettingsSection.svelte"
  import { builderStore } from "@/stores/builder"

  export let componentInstance
  export let componentDefinition
  export let componentBindings
  export let bindings

  let tempValue
  let drawer

  $: highlighted = $builderStore.highlightedSetting?.key === "_conditions"

  const openDrawer = () => {
    tempValue = JSON.parse(JSON.stringify(componentInstance?._conditions ?? []))
    drawer.show()
  }

  const save = async () => {
    try {
      await componentStore.updateConditions(tempValue)
    } catch (error) {
      notifications.error("Error updating conditions")
    }
    drawer.hide()
  }

  $: conditionCount = componentInstance?._conditions?.length
  $: conditionText = `${conditionCount || "No"} condition${
    conditionCount !== 1 ? "s" : ""
  } set`
</script>

<!--
  Load any general settings or sections tagged as "condition"
-->
<ComponentSettingsSection
  {componentInstance}
  {componentDefinition}
  isScreen={false}
  showInstanceName={false}
  {bindings}
  {componentBindings}
  tag="condition"
/>

<DetailSummary name={"Conditions"} collapsible={false}>
  <div class:highlighted>
    <ActionButton fullWidth on:click={openDrawer}>{conditionText}</ActionButton>
  </div>
</DetailSummary>
<Drawer bind:this={drawer} title="Conditions">
  <svelte:fragment slot="description">
    Show, hide and update components in response to conditions being met.
  </svelte:fragment>
  <Button cta slot="buttons" on:click={() => save()}>Save</Button>
  <ConditionalUIDrawer
    slot="body"
    bind:conditions={tempValue}
    {bindings}
    {componentBindings}
  />
</Drawer>

<style>
  .highlighted {
    background: var(--spectrum-global-color-gray-300);
    border-left: 4px solid var(--spectrum-semantic-informative-color-background);
    transition:
      background 130ms ease-out,
      border-color 130ms ease-out;
    margin: -4px calc(-1 * var(--spacing-xl));
    padding: 4px var(--spacing-xl) 4px calc(var(--spacing-xl) - 4px);
  }
</style>
