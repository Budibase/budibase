<script>
  import EditComponentPopover from "../EditComponentPopover.svelte"
  import { Icon, Toggle } from "@budibase/bbui"
  import { setContext, createEventDispatcher } from "svelte"
  import { writable } from "svelte/store"
  import { FieldTypeToComponentMap } from "../FieldConfiguration/utils"
  import { componentStore } from "@/stores/builder"
  import { cloneDeep } from "lodash/fp"

  export let item
  export let anchor
  export let bindings

  const dispatch = createEventDispatcher()

  let draggableStore = writable({
    selected: null,
    actions: {
      select: id => {
        draggableStore.update(state => ({
          ...state,
          selected: id,
        }))
      },
    },
  })

  setContext("draggable", draggableStore)

  const parseSettings = settings => {
    return settings
      .filter(setting => setting.key !== "field")
      .map(setting => {
        return { ...setting, nested: true }
      })
  }

  const getIcon = item => {
    const component = `@budibase/standard-components/${
      FieldTypeToComponentMap[item.columnType]
    }`
    return componentStore.getDefinition(component)?.icon
  }

  const onToggle = item => {
    return e => {
      item.active = e.detail
      dispatch("change", { ...cloneDeep(item), active: e.detail })
    }
  }

  $: icon = getIcon(item)
</script>

<div class="list-item-body">
  <div class="list-item-left">
    <EditComponentPopover
      {anchor}
      componentInstance={item}
      {parseSettings}
      on:change
      {bindings}
    >
      <div slot="header" class="type-icon">
        <Icon name={icon} />
        <span>{item.field}</span>
      </div>
    </EditComponentPopover>
    <div class="field-label">{item.label || item.field}</div>
  </div>
  <div class="list-item-right">
    <Toggle
      on:click={e => {
        e.stopPropagation()
      }}
      on:change={onToggle(item)}
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
