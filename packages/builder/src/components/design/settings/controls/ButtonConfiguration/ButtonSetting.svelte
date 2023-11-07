<script>
  import EditComponentPopover from "../EditComponentPopover.svelte"
  import { Icon } from "@budibase/bbui"
  import { runtimeToReadableBinding } from "builderStore/dataBinding"
  import { isJSBinding } from "@budibase/string-templates"

  export let item
  export let componentBindings
  export let bindings
  export let anchor
  export let removeButton
  export let canRemove
  export let nested

  $: readableText = isJSBinding(item.text)
    ? "(JavaScript function)"
    : runtimeToReadableBinding([...bindings, componentBindings], item.text)

  // If this is a nested setting (for example inside a grid or form block) then
  // we need to mark all the settings of the actual buttons as nested too, to
  // allow up to reference context provided by the block
  const updatedNestedFlags = settings => {
    if (!nested) {
      return settings
    }
    // Buttons do not currently have any sections, so this works.
    // We will need to update this in future if the normal button component
    // gets broken into multiple settings sections
    return settings?.map(setting => ({
      ...setting,
      nested: true,
    }))
  }
</script>

<div class="list-item-body">
  <div class="list-item-left">
    <EditComponentPopover
      {anchor}
      componentInstance={item}
      {componentBindings}
      {bindings}
      on:change
      parseSettings={updatedNestedFlags}
    />
    <div class="field-label">{readableText || "Button"}</div>
  </div>
  <div class="list-item-right">
    <Icon
      disabled={!canRemove}
      size="S"
      name="Close"
      hoverable
      on:click={() => removeButton(item._id)}
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
