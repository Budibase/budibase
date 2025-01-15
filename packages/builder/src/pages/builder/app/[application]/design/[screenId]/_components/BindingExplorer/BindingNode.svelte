<script lang="ts">
  import { Icon } from "@budibase/bbui"

  export let label: string | undefined
  export let value: any
  export let root: boolean = true
  export let path: (string | number)[] = []

  const Colors = {
    Undefined: "var(--spectrum-global-color-gray-600)",
    Null: "purple",
    String: "orange",
    Number: "blue",
    True: "green",
    False: "red",
    Date: "pink",
  }

  let expanded = false

  $: isArray = Array.isArray(value)
  $: isObject = value?.toString?.() === "[object Object]"
  $: keys = isArray || isObject ? Object.keys(value).sort() : []
  $: expandable = keys.length > 0
  $: displayValue = getDisplayValue(isArray, isObject, keys, value)
  $: style = getStyle(expandable, value)
  $: readableBinding = `{{ ${path.join(".")} }}`

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
      return JSON.stringify(value.toString(), null, 2)
    } else {
      return JSON.stringify(value, null, 2)
    }
  }

  const getStyle = (expandable: boolean, value: any) => {
    let style = ""
    const color = getColor(expandable, value)
    if (color) {
      style += `color:${color};`
    }
    return style
  }

  const getColor = (expandable: boolean, value: any) => {
    if (expandable) {
      return
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
  }

  $: console.log(path)
</script>

<div class="binding-node">
  {#if label}
    <div class="binding-text" title={readableBinding}>
      <div class="binding-arrow">
        {#if expandable}
          <Icon
            name={expanded ? "ChevronDown" : "ChevronRight"}
            hoverable
            color="var(--spectrum-global-color-gray-600)"
            on:click={() => (expanded = !expanded)}
          />
        {/if}
      </div>
      <div class="binding-label" class:expandable>
        {label}
      </div>
      <div class="binding-value" class:expandable {style}>
        {displayValue}
      </div>
    </div>
  {/if}
  {#if expandable && (expanded || !label)}
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
  }
  .binding-value {
    flex: 1 1 auto;
    color: var(--spectrum-global-color-gray-600);
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
