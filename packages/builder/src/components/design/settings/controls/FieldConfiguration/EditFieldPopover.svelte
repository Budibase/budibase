<script>
  import { Icon, Popover, Layout } from "@budibase/bbui"
  import { store } from "builderStore"
  import { cloneDeep } from "lodash/fp"
  import { createEventDispatcher } from "svelte"
  import ComponentSettingsSection from "../../../../../pages/builder/app/[application]/design/[screenId]/[componentId]/_components/Component/ComponentSettingsSection.svelte"

  export let anchor
  export let field
  export let componentBindings
  export let bindings

  const dispatch = createEventDispatcher()

  let popover
  let drawers = []
  let sudoComponentInstance

  $: if (field) {
    sudoComponentInstance = field
  }
  $: componentDef = store.actions.components.getDefinition(
    sudoComponentInstance._component
  )
  $: parsedComponentDef = processComponentDefinitionSettings(componentDef)

  const processComponentDefinitionSettings = componentDef => {
    if (!componentDef) {
      return {}
    }
    const clone = cloneDeep(componentDef)
    const updatedSettings = clone.settings
      .filter(setting => setting.key !== "field")
      .map(setting => {
        return { ...setting, nested: true }
      })
    clone.settings = updatedSettings
    return clone
  }

  const updateSetting = async (setting, value) => {
    const nestedComponentInstance = cloneDeep(sudoComponentInstance)

    const patchFn = store.actions.components.updateComponentSetting(
      setting.key,
      value
    )
    patchFn(nestedComponentInstance)

    const update = {
      ...nestedComponentInstance,
      active: sudoComponentInstance.active,
    }

    dispatch("change", update)
  }
</script>

<Icon
  name="Settings"
  hoverable
  size="S"
  on:click={() => {
    popover.show()
  }}
/>

<Popover
  bind:this={popover}
  on:open={() => {
    drawers = []
  }}
  {anchor}
  align="left-outside"
  showPopover={drawers.length == 0}
  clickOutsideOverride={drawers.length > 0}
>
  <span class="popover-wrap">
    <Layout noPadding noGap>
      <div class="type-icon">
        <Icon name={parsedComponentDef.icon} />
        <span>{parsedComponentDef.name}</span>
      </div>
      <ComponentSettingsSection
        componentInstance={sudoComponentInstance}
        componentDefinition={parsedComponentDef}
        isScreen={false}
        onUpdateSetting={updateSetting}
        showSectionTitle={false}
        showInstanceName={false}
        {bindings}
        {componentBindings}
        on:drawerShow={e => {
          drawers = [...drawers, e.detail]
        }}
        on:drawerHide={e => {
          drawers = drawers.slice(0, -1)
        }}
      />
    </Layout>
  </span>
</Popover>

<style>
  .popover-wrap {
    background-color: var(--spectrum-alias-background-color-secondary);
  }
  .type-icon {
    display: flex;
    gap: var(--spacing-m);
    margin: var(--spacing-xl);
    margin-bottom: 0px;
    height: var(--spectrum-alias-item-height-m);
    padding: 0px var(--spectrum-alias-item-padding-m);
    border-width: var(--spectrum-actionbutton-border-size);
    border-radius: var(--spectrum-alias-border-radius-regular);
    border: 1px solid
      var(
        --spectrum-actionbutton-m-border-color,
        var(--spectrum-alias-border-color)
      );
    align-items: center;
  }
</style>
