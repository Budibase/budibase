<script>
  import EditComponentPopover from "../EditComponentPopover.svelte"
  import { Toggle, Icon } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"
  import { cloneDeep } from "lodash/fp"
  import { FIELDS } from "@/constants/backend"
  import { Constants } from "@budibase/frontend-core"
  import { FieldType } from "@budibase/types"

  export let item
  export let anchor
  export let bindings

  const dispatch = createEventDispatcher()

  $: fieldIconLookupMap = buildFieldIconLookupMap(FIELDS)

  const buildFieldIconLookupMap = fields => {
    let map = {}
    Object.values(fields).forEach(fieldInfo => {
      map[fieldInfo.type] = fieldInfo.icon
    })
    return map
  }

  const onToggle = item => {
    return e => {
      item.active = e.detail
      dispatch("change", { ...cloneDeep(item), active: e.detail })
    }
  }

  const parseSettings = settings => {
    let columnSettings = settings
      .filter(setting => setting.key !== "field")
      .map(setting => {
        return { ...setting, nested: true }
      })

    // Filter out conditions for invalid types.
    // Allow formulas as we have all the data already loaded in the table.
    if (
      Constants.BannedSearchTypes.includes(item.columnType) &&
      item.columnType !== FieldType.FORMULA
    ) {
      return columnSettings.filter(x => x.key !== "conditions")
    }
    return columnSettings
  }
</script>

<div class="list-item-body">
  <div class="list-item-left">
    <EditComponentPopover
      componentInstance={item}
      {bindings}
      {anchor}
      {parseSettings}
      on:change
    >
      <div slot="header" class="type-icon">
        <Icon name={fieldIconLookupMap[item.columnType]} />
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
  .type-icon span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 0;
    flex: 1 1 auto;
  }
</style>
