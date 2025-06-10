<script context="module" lang="ts">
  interface JSONViewerClickContext {
    label: string | undefined
    value: any
    path: (string | number)[]
  }
  export interface JSONViewerClickEvent {
    detail: JSONViewerClickContext
  }
</script>

<script lang="ts">
  import { Icon } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"

  export let label: string | undefined = undefined
  export let value: any = undefined
  export let root: boolean = true
  export let path: (string | number)[] = []
  export let showCopyIcon: boolean = false

  const dispatch = createEventDispatcher()
  const Colors = {
    Array: "var(--spectrum-global-color-gray-600)",
    Object: "var(--spectrum-global-color-gray-600)",
    Other: "var(--spectrum-global-color-blue-700)",
    Undefined: "var(--spectrum-global-color-gray-600)",
    Null: "var(--spectrum-global-color-yellow-700)",
    String: "var(--spectrum-global-color-orange-700)",
    Number: "var(--spectrum-global-color-purple-700)",
    True: "var(--spectrum-global-color-celery-700)",
    False: "var(--spectrum-global-color-red-700)",
    Date: "var(--spectrum-global-color-green-700)",
  }

  let expanded = false
  let valueExpanded = false
  let clickContext: JSONViewerClickContext

  $: isArray = Array.isArray(value)
  $: isObject = value?.toString?.() === "[object Object]"
  $: primitive = !(isArray || isObject)
  $: keys = getKeys(isArray, isObject, value)
  $: expandable = keys.length > 0
  $: displayValue = getDisplayValue(isArray, isObject, keys, value)
  $: style = getStyle(isArray, isObject, value)
  $: clickContext = { value, label, path }

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
    if (value instanceof Date) {
      return Colors.Date
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
    return Colors.Other
  }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="binding-node">
  {#if label != null}
    <div class="binding-text">
      <div class="binding-arrow" class:expanded>
        {#if expandable}
          <Icon
            name="play"
            hoverable
            color="var(--spectrum-global-color-gray-600)"
            hoverColor="var(--spectrum-global-color-gray-900)"
            on:click={() => (expanded = !expanded)}
            size="XS"
            weight="fill"
          />
        {/if}
      </div>
      <div
        class="binding-label"
        class:primitive
        class:expandable
        on:click={() => (expanded = !expanded)}
        on:click={() => dispatch("click-label", clickContext)}
      >
        {label}
      </div>
      <div
        class="binding-value"
        class:primitive
        class:expanded={valueExpanded}
        {style}
        on:click={() => (valueExpanded = !valueExpanded)}
        on:click={() => dispatch("click-value", clickContext)}
      >
        {displayValue}
      </div>
      {#if showCopyIcon}
        <div class="copy-value-icon">
          <Icon
            name="copy"
            size="S"
            hoverable
            color="var(--spectrum-global-color-gray-600)"
            hoverColor="var(--spectrum-global-color-gray-900)"
            on:click={() => dispatch("click-copy", clickContext)}
          />
        </div>
      {/if}
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
          {showCopyIcon}
          on:click-label
          on:click-value
          on:click-copy
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

  /* Expand arrow */
  .binding-arrow {
    margin: 3px 6px 0 4px;
    flex: 0 0 10px;
    transition: transform 130ms ease-out;
  }
  .binding-arrow :global(i) {
    width: 10px;
  }
  .binding-arrow.expanded {
    transform: rotate(90deg);
  }

  /* Main text wrapper */
  .binding-text {
    display: flex;
    flex-direction: row;
    font-family: monospace;
    font-size: 12px;
    align-items: flex-start;
    width: 100%;
  }

  /* Size label and value according to type */
  .binding-label {
    flex: 0 1 auto;
    margin-right: 8px;
    transition: color 130ms ease-out;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .binding-label.expandable:hover {
    cursor: pointer;
    color: var(--spectrum-global-color-gray-900);
  }
  .binding-value {
    flex: 0 0 auto;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    transition: filter 130ms ease-out;
  }
  .binding-value.primitive:hover {
    filter: brightness(1.25);
    cursor: pointer;
  }
  .binding-value.expanded {
    word-break: break-all;
    white-space: wrap;
  }
  .binding-label.primitive {
    flex: 0 0 auto;
    max-width: 75%;
  }
  .binding-value.primitive {
    flex: 0 1 auto;
  }

  /* Trim spans in the highlighted HTML */
  .binding-value :global(span) {
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    white-space: nowrap !important;
  }

  /* Copy icon for value */
  .copy-value-icon {
    display: none;
    margin-left: 8px;
  }
  .binding-text:hover .copy-value-icon {
    display: block;
  }

  /* Children wrapper */
  .binding-children {
    display: flex;
    flex-direction: column;
    gap: 8px;
    border-left: 1px solid var(--spectrum-global-color-gray-400);
    margin-left: 20px;
    padding-left: 3px;
  }
  .binding-children.root {
    border-left: none;
    margin-left: 0;
    padding-left: 0;
  }
</style>
