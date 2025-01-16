<script lang="ts">
  import { AbsTooltip, Icon, TooltipPosition } from "@budibase/bbui"

  export let label: string | undefined = undefined
  export let value: any = undefined
  export let root: boolean = true
  export let path: (string | number)[] = []

  const Colors = {
    Array: "var(--spectrum-global-color-gray-600)",
    Object: "var(--spectrum-global-color-gray-600)",
    Other: "var(--spectrum-global-color-indigo-600)",
    Undefined: "var(--spectrum-global-color-gray-500)",
    Null: "var(--spectrum-global-color-magenta-600)",
    String: "var(--spectrum-global-color-orange-600)",
    Number: "var(--spectrum-global-color-blue-600)",
    True: "var(--spectrum-global-color-green-600)",
    False: "var(--spectrum-global-color-red-600)",
    Date: "var(--spectrum-global-color-green-600)",
  }

  let expanded = false

  $: isArray = Array.isArray(value)
  $: isObject = value?.toString?.() === "[object Object]"
  $: keys = getKeys(isArray, isObject, value)
  $: expandable = keys.length > 0
  $: displayValue = getDisplayValue(isArray, isObject, keys, value)
  $: style = getStyle(isArray, isObject, value)
  $: readableBinding = `{{ ${path.join(".")} }}`

  const getKeys = (isArray: boolean, isObject: boolean, value: any) => {
    if (isArray) {
      return [...value.keys()]
    }
    if (isObject) {
      return Object.keys(value).sort()
    }
    return []
  }

  const pluralise = (text: string, number: number) => {
    return number === 1 ? text : text + "s"
  }

  const getDisplayValue = (
    isArray: boolean,
    isObject: boolean,
    keys: any[],
    value: any
  ) => {
    if (isArray) {
      return `[] ${keys.length} ${pluralise("item", keys.length)}`
    }
    if (isObject) {
      return `{} ${keys.length} ${pluralise("key", keys.length)}`
    }
    if (typeof value === "object" && typeof value?.toString === "function") {
      return value.toString()
    } else {
      return JSON.stringify(value, null, 2)
    }
  }

  const getStyle = (isArray: boolean, isObject: boolean, value: any) => {
    return `color:${getColor(isArray, isObject, value)};`
  }

  const getColor = (isArray: boolean, isObject: boolean, value: any) => {
    if (isArray) {
      return Colors.Array
    }
    if (isObject) {
      return Colors.Object
    }
    switch (value) {
      case undefined:
        return Colors.Undefined
      case null:
        return Colors.Null
      case true:
        return Colors.True
      case false:
        return Colors.False
    }
    switch (typeof value) {
      case "string":
        return Colors.String
      case "number":
        return Colors.Number
    }
    if (value instanceof Date) {
      return Colors.Date
    }
    return Colors.Other
  }
</script>

<div class="binding-node">
  {#if label != null}
    <div class="binding-text">
      <div class="binding-arrow">
        {#if expandable}
          <Icon
            name={expanded ? "ChevronDown" : "ChevronRight"}
            hoverable
            color="var(--spectrum-global-color-gray-600)"
            hoverColor="var(--spectrum-global-color-gray-900)"
            on:click={() => (expanded = !expanded)}
          />
        {/if}
      </div>
      <div
        class="binding-label"
        class:expandable
        on:click={() => (expanded = !expanded)}
      >
        {label}
      </div>
      <AbsTooltip
        text={isArray || isObject ? null : displayValue}
        position={TooltipPosition.Right}
      >
        <div class="binding-value" class:expandable {style}>
          {displayValue}
        </div>
      </AbsTooltip>
    </div>
  {/if}
  {#if expandable && (expanded || label == null)}
    <div class="binding-children" class:root>
      {#each keys as key}
        <svelte:self
          label={key}
          value={value[key]}
          root={false}
          path={[...path, key]}
        />
      {/each}
    </div>
  {/if}
</div>

<style>
  .binding-node {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 8px;
    overflow: hidden;
  }
  .binding-arrow {
    margin-right: 2px;
    flex: 0 0 18px;
  }
  .binding-text {
    display: flex;
    flex-direction: row;
    align-items: center;
    font-family: monospace;
    font-size: 12px;
    width: 100%;
  }
  .binding-children {
    display: flex;
    flex-direction: column;
    gap: 8px;
    /* border-left: 1px solid var(--spectrum-global-color-gray-400); */
    /* margin-left: 20px; */
    padding-left: 18px;
  }
  .binding-children.root {
    border-left: none;
    margin-left: 0;
    padding-left: 0;
  }

  /* Size label and value according to type */
  .binding-label,
  .binding-value {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .binding-label {
    flex: 0 0 auto;
    max-width: 50%;
    margin-right: 8px;
    transition: color 130ms ease-out;
  }
  .binding-label.expandable:hover {
    cursor: pointer;
    color: var(--spectrum-global-color-gray-900);
  }
  .binding-value {
    flex: 0 1 auto;
  }
  .binding-label.expandable {
    flex: 0 1 auto;
    max-width: none;
  }
  .binding-value.expandable {
    flex: 0 0 auto;
  }

  /* Trim spans in the highlighted HTML */
  .binding-value :global(span) {
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    white-space: nowrap !important;
  }
</style>
