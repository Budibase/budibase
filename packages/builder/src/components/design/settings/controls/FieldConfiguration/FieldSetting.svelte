<script>
  import EditComponentPopover from "../EditComponentPopover.svelte"
  import { Toggle, Icon } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"
  import { cloneDeep } from "lodash/fp"
  import { runtimeToReadableBinding } from "@/dataBinding"
  import { isJSBinding } from "@budibase/string-templates"
  import { componentStore } from "@/stores/builder"

  export let item
  export let componentBindings
  export let bindings
  export let anchor

  const dispatch = createEventDispatcher()
  const onToggle = item => {
    return e => {
      item.active = e.detail
      dispatch("change", { ...cloneDeep(item), active: e.detail })
    }
  }
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
  $: componentDef = componentStore.getDefinition(item._component)
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
  <div class="list-item-right">
    <Toggle
      on:change={onToggle(item)}
      on:click={e => {
        e.stopPropagation()
      }}
      text=""
      value={item.active}
      thin
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
  .list-item-right :global(div.spectrum-Switch) {
    margin: 0px;
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
