<script>
  import EditFieldPopover from "./EditFieldPopover.svelte"
  import { Toggle } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"
  import { cloneDeep } from "lodash/fp"

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
</script>

<div class="list-item-body">
  <div class="list-item-left">
    <EditFieldPopover
      {anchor}
      field={item}
      {componentBindings}
      {bindings}
      on:change
    />
    <div class="field-label">{item.label || item.field}</div>
  </div>
  <div class="list-item-right">
    <Toggle on:change={onToggle(item)} text="" value={item.active} thin />
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
</style>
