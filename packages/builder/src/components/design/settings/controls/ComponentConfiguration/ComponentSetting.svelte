<script lang="ts">
  import EditComponentPopover from "../EditComponentPopover.svelte"
  import { Icon } from "@budibase/bbui"
  import { componentStore } from "@/stores/builder"
  import type { ComponentSetting } from "@budibase/types"

  export let item
  export let bindings
  export let anchor
  export let removeComponent
  export let nested
  export let showInstanceName = false
  export let settings

  $: componentDef = componentStore.getDefinition(item._component)
  $: displayName = getDisplayName(showInstanceName, item, componentDef)

  function getDisplayName(
    showInstanceName: boolean,
    item: any,
    componentDef: any
  ) {
    if (showInstanceName && item._instanceName) {
      return item._instanceName
    }
    return (
      componentDef?.friendlyName ||
      componentDef?.name ||
      item._instanceName ||
      "Component"
    )
  }

  // If this is a nested setting (for example inside a grid or form block) then
  // we need to mark all the settings of the actual components as nested too, to
  // allow us to reference context provided by the block.
  // We will need to update this in future if the component gets broken into
  // multiple settings sections, as we assume a flat array.
  const updatedNestedFlags = (originalSettings: ComponentSetting[]) => {
    const effectiveSettings = settings || originalSettings
    if (!nested || !effectiveSettings?.length) {
      return effectiveSettings
    }
    let newSettings = effectiveSettings.map((setting: ComponentSetting) => ({
      ...setting,
      nested: true,
    }))
    return newSettings
  }
</script>

<div class="list-item-body">
  <div class="list-item-left">
    <EditComponentPopover
      {anchor}
      componentInstance={item}
      {bindings}
      on:change
      parseSettings={updatedNestedFlags}
    />
    <div class="field-label">{displayName}</div>
  </div>
  <div class="list-item-right">
    <Icon
      size="S"
      name="x"
      hoverable
      on:click={e => {
        e.stopPropagation()
        removeComponent(item._id)
      }}
    />
  </div>
</div>

<style>
  .field-label {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  .list-item-body,
  .list-item-left {
    display: flex;
    align-items: center;
    gap: var(--spacing-m);
    min-width: 0;
  }
  .list-item-body {
    margin-top: 8px;
    margin-bottom: 8px;
  }
  .list-item-right :global(div.spectrum-Switch) {
    margin: 0px;
  }
  .list-item-body {
    justify-content: space-between;
  }
</style>
