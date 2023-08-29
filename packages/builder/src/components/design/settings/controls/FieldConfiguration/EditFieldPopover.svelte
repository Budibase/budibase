<script>
  import { Icon, Popover, Layout } from "@budibase/bbui"
  import { store } from "builderStore"
  import { cloneDeep } from "lodash/fp"
  import { createEventDispatcher } from "svelte"
  import ComponentSettingsSection from "../../../../../pages/builder/app/[application]/design/[screenId]/[componentId]/_components/Component/ComponentSettingsSection.svelte"
  import { getContext } from "svelte"

  export let anchor
  export let field
  export let componentBindings
  export let bindings

  const draggable = getContext("draggable")
  const dispatch = createEventDispatcher()

  let popover
  let drawers = []
  let pseudoComponentInstance
  let open = false

  $: if (open && $draggable.selected && $draggable.selected != field._id) {
    popover.hide()
  }

  $: if (field) {
    pseudoComponentInstance = field
  }
  $: componentDef = store.actions.components.getDefinition(
    pseudoComponentInstance._component
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
    const nestedComponentInstance = cloneDeep(pseudoComponentInstance)

    const patchFn = store.actions.components.updateComponentSetting(
      setting.key,
      value
    )
    patchFn(nestedComponentInstance)

    const update = {
      ...nestedComponentInstance,
      active: pseudoComponentInstance.active,
    }

    dispatch("change", update)
  }
</script>

<Icon
  name="Settings"
  hoverable
  size="S"
  on:click={() => {
    if (!open) {
      popover.show()
      open = true
    }
  }}
/>

<Popover
  bind:this={popover}
  on:open={() => {
    drawers = []
    $draggable.actions.select(field._id)
  }}
  on:close={() => {
    open = false
    if ($draggable.selected == field._id) {
      $draggable.actions.select()
    }
  }}
  {anchor}
  align="left-outside"
  showPopover={drawers.length == 0}
  clickOutsideOverride={drawers.length > 0}
  maxHeight={600}
  handlePostionUpdate={(anchorBounds, eleBounds, cfg) => {
    let { left, top } = cfg
    let percentageOffset = 30
    // left-outside
    left = anchorBounds.left - eleBounds.width - 18

    // shift up from the anchor, if space allows
    let offsetPos = Math.floor(eleBounds.height / 100) * percentageOffset
    let defaultTop = anchorBounds.top - offsetPos

    if (window.innerHeight - defaultTop < eleBounds.height) {
      top = window.innerHeight - eleBounds.height - 5
    } else {
      top = anchorBounds.top - offsetPos
    }

    return { ...cfg, left, top }
  }}
>
  <span class="popover-wrap">
    <Layout noPadding noGap>
      <div class="type-icon">
        <Icon name={parsedComponentDef.icon} />
        <span>{field.field}</span>
      </div>
      <ComponentSettingsSection
        componentInstance={pseudoComponentInstance}
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
        on:drawerHide={() => {
          drawers = drawers.slice(0, -1)
        }}
      />
    </Layout>
  </span>
</Popover>

<style>
  .popover-wrap {
    background-color: var(--spectrum-alias-background-color-primary);
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
