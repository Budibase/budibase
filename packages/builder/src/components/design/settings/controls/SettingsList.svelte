<script>
  import { Toggle, Icon } from "@budibase/bbui"
  import { dndzone } from "svelte-dnd-action"
  import { flip } from "svelte/animate"
  import { createEventDispatcher } from "svelte"

  export let value = []
  export let showHandle = true
  export let rightButton
  export let rightProps = {}

  const dispatch = createEventDispatcher()
  const flipDurationMs = 150
  let dragDisabled = false
  let listOptions = [...value]
  let anchors = {}

  const updateColumnOrder = e => {
    listOptions = e.detail.items
  }

  const handleFinalize = e => {
    updateColumnOrder(e)
    dispatch("change", listOptions)
    dragDisabled = false
  }

  // This is optional and should be moved.
  const onToggle = item => {
    return e => {
      console.log(`${item.name} toggled: ${e.detail}`)
      item.active = e.detail
      dispatch("change", listOptions)
    }
  }
</script>

<ul
  class="list-wrap"
  use:dndzone={{
    items: listOptions,
    flipDurationMs,
    dropTargetStyle: { outline: "none" },
    dragDisabled,
  }}
  on:finalize={handleFinalize}
  on:consider={updateColumnOrder}
>
  {#each listOptions as item (item.id)}
    <li
      animate:flip={{ duration: flipDurationMs }}
      bind:this={anchors[item.id]}
    >
      <div class="left-content">
        {#if showHandle}
          <div
            class="handle"
            aria-label="drag-handle"
            style={dragDisabled ? "cursor: grab" : "cursor: grabbing"}
          >
            <Icon name="DragHandle" size="XL" />
          </div>
        {/if}
        <!-- slot - left action -->
        <Toggle on:change={onToggle(item)} text="" value={item.active} thin />
        {item.name}
      </div>
      <!-- slot - right action -->
      <div class="right-content">
        {#if rightButton}
          <svelte:component
            this={rightButton}
            anchor={anchors[item.id]}
            field={item}
            componentBindings={rightProps.componentBindings}
            bindings={rightProps.bindings}
            parent={rightProps.parent}
          />
        {/if}
      </div>
    </li>
  {/each}
</ul>

<style>
  .list-wrap {
    list-style-type: none;
    margin: 0;
    padding: 0;
    width: 100%;
    border-radius: 4px;
    background-color: var(
      --spectrum-table-background-color,
      var(--spectrum-global-color-gray-50)
    );
    border: 1px solid
      var(--spectrum-table-border-color, var(--spectrum-alias-border-color-mid));
  }
  .list-wrap > li {
    background-color: var(
      --spectrum-table-background-color,
      var(--spectrum-global-color-gray-50)
    );
    transition: background-color ease-in-out 130ms;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid
      var(--spectrum-table-border-color, var(--spectrum-alias-border-color-mid));
  }
  .list-wrap > li:hover {
    background-color: var(
      --spectrum-table-row-background-color-hover,
      var(--spectrum-alias-highlight-hover)
    );
  }
  .list-wrap > li:first-child {
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
  }
  .list-wrap > li:last-child {
    border-top-left-radius: var(--spectrum-table-regular-border-radius);
    border-top-right-radius: var(--spectrum-table-regular-border-radius);
  }
  .left-content {
    display: flex;
    align-items: center;
  }
  .list-wrap li {
    padding-left: var(--spacing-s);
    padding-right: var(--spacing-s);
  }
</style>
