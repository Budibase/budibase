<script>
  import { Icon, Popover, Layout } from "@budibase/bbui"
  import { componentStore } from "stores/builder"
  import { cloneDeep } from "lodash/fp"
  import { createEventDispatcher, getContext } from "svelte"
  import ComponentSettingsSection from "pages/builder/app/[application]/design/[screenId]/[componentId]/_components/Component/ComponentSettingsSection.svelte"

  export let anchor
  export let componentInstance
  export let componentBindings
  export let bindings
  export let parseSettings
  export let disabled

  const draggable = getContext("draggable")
  const dispatch = createEventDispatcher()

  let popover
  let drawers = []
  let open = false

  // Auto hide the component when another item is selected
  $: if (open && $draggable.selected !== componentInstance._id) {
    popover.hide()
  }

  // Open automatically if the component is marked as selected
  $: if (!open && $draggable.selected === componentInstance._id && popover) {
    popover.show()
    open = true
  }

  $: componentDef = componentStore.getDefinition(componentInstance._component)
  $: parsedComponentDef = processComponentDefinitionSettings(componentDef)

  const processComponentDefinitionSettings = componentDef => {
    if (!componentDef) {
      return {}
    }
    const clone = cloneDeep(componentDef)

    if (typeof parseSettings === "function") {
      clone.settings = parseSettings(clone.settings)
    }

    return clone
  }

  const updateSetting = async (setting, value) => {
    const nestedComponentInstance = cloneDeep(componentInstance)

    const patchFn = componentStore.updateComponentSetting(setting.key, value)
    patchFn(nestedComponentInstance)

    dispatch("change", nestedComponentInstance)
  }

  const customPositionHandler = (anchorBounds, eleBounds, cfg) => {
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
    $draggable.actions.select(componentInstance._id)
  }}
  on:close={() => {
    open = false
    if ($draggable.selected === componentInstance._id) {
      $draggable.actions.select()
    }
  }}
  {anchor}
  align="left-outside"
  showPopover={drawers.length === 0}
  clickOutsideOverride={drawers.length > 0}
  maxHeight={600}
  handlePostionUpdate={customPositionHandler}
>
  <span class="popover-wrap">
    <Layout noPadding noGap>
      <slot name="header" />
      <ComponentSettingsSection
        includeHidden
        {componentInstance}
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
</style>
