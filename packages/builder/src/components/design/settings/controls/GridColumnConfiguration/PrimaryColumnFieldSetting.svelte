<script>
  import EditComponentPopover from "../EditComponentPopover.svelte"
  import { Icon } from "@budibase/bbui"
  import { setContext } from "svelte"
  import { writable } from "svelte/store"
  import { FieldTypeToComponentMap } from "../FieldConfiguration/utils"
  import { componentStore } from "@/stores/builder"

  export let item
  export let anchor

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

  $: icon = getIcon(item)
</script>

<div class="list-item-body">
  <div class="list-item-left">
    <EditComponentPopover
      {anchor}
      componentInstance={item}
      {parseSettings}
      on:change
    >
      <div slot="header" class="type-icon">
        <Icon name={icon} />
        <span>{item.field}</span>
      </div>
    </EditComponentPopover>
    <div class="field-label">{item.label || item.field}</div>
  </div>
  <div title="The display column is always shown first" class="list-item-right">
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
