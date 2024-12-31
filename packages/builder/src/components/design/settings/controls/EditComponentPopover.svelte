<script>
  import { Icon, Popover, Layout } from "@budibase/bbui"
  import { componentStore } from "@/stores/builder"
  import { cloneDeep } from "lodash/fp"
  import { createEventDispatcher, getContext } from "svelte"
  import ComponentSettingsSection from "@/pages/builder/app/[application]/design/[screenId]/[componentId]/_components/Component/ComponentSettingsSection.svelte"

  export let anchor
  export let componentInstance
  export let componentBindings
  export let bindings
  export let parseSettings

  const draggable = getContext("draggable")
  const dispatch = createEventDispatcher()

  let popover
  let drawers = []
  let isOpen = false

  // Auto hide the component when another item is selected
  $: if (open && $draggable.selected !== componentInstance._id) {
    close()
  }
  // Open automatically if the component is marked as selected
  $: if (!open && $draggable.selected === componentInstance._id && popover) {
    open()
  }
  $: componentDef = componentStore.getDefinition(componentInstance._component)
  $: parsedComponentDef = processComponentDefinitionSettings(componentDef)

  const open = () => {
    isOpen = true
    drawers = []
    $draggable.actions.select(componentInstance._id)
  }

  const close = () => {
    // Slight delay allows us to be able to properly toggle open/close state by
    // clicking again on the settings icon
    setTimeout(() => {
      isOpen = false
      if ($draggable.selected === componentInstance._id) {
        $draggable.actions.select()
      }
    }, 10)
  }

  const toggleOpen = () => {
    if (isOpen) {
      close()
    } else {
      open()
    }
  }

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
</script>

<Icon name="Settings" hoverable size="S" on:click={toggleOpen} />

<Popover
  open={isOpen}
  on:close={close}
  {anchor}
  align="left-outside"
  showPopover={drawers.length === 0}
  clickOutsideOverride={drawers.length > 0}
  maxHeight={600}
  minWidth={360}
  maxWidth={360}
  offset={18}
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
