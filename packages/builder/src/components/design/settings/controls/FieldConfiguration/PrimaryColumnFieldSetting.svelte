<script>
  import EditComponentPopover from "../EditComponentPopover.svelte"
  import { Icon } from "@budibase/bbui"
  import { store } from "builderStore"
  import { runtimeToReadableBinding } from "builderStore/dataBinding"
  import { isJSBinding } from "@budibase/string-templates"

  export let item
  export let componentBindings
  export let bindings
  export let anchor
  export let hideToggle = false

  const getReadableText = () => {
    if (item.label) {
      return isJSBinding(item.label)
        ? "(JavaScript function)"
        : runtimeToReadableBinding([...bindings, componentBindings], item.label)
    }
    return item.field
  }

  const parseSettings = settings => {
    return settings
      .filter(setting => setting.key !== "field")
      .map(setting => {
        return { ...setting, nested: true }
      })
  }

  $: readableText = getReadableText(item)
  $: componentDef = store.actions.components.getDefinition(item._component)
</script>

<div class="list-item-body">
  <div class="list-item-left">
    <EditComponentPopover
      {anchor}
      componentInstance={item}
      {componentBindings}
      {bindings}
      {parseSettings}
      on:change
    >
      <div slot="header" class="type-icon">
        <Icon name={componentDef.icon} />
        <span>{item.field}</span>
      </div>
    </EditComponentPopover>
    <div class="field-label">{readableText}</div>
  </div>
  <div
    title="The leftmost column is dictated by your datasource's primary column, which can be changed in the data section"
    class="list-item-right"
  >
    <Icon name={"Info"} />
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
  .list-item-right :global(svg) {
    color: var(--grey-5);
    padding: 7px 5px 7px 0;
  }
  .list-item-body {
    justify-content: space-between;
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
