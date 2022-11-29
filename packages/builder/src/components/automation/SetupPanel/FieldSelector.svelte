<script>
  import { createEventDispatcher } from "svelte"
  import RowSelectorTypes from "./RowSelectorTypes.svelte"

  const dispatch = createEventDispatcher()

  export let value
  export let bindings
  export let block
  export let isTestModal

  let schemaFields

  $: {
    let fields = {}

    for (const [key, type] of Object.entries(block?.inputs?.fields ?? {})) {
      fields = {
        ...fields,
        [key]: {
          type: type,
          name: key,
          fieldName: key,
          constraints: { type: type },
        },
      }

      if (value[key] === type) {
        value[key] = INITIAL_VALUES[type.toUpperCase()]
      }
    }

    schemaFields = Object.entries(fields)
  }

  const INITIAL_VALUES = {
    BOOLEAN: null,
    NUMBER: null,
    DATETIME: null,
    STRING: "",
    OPTIONS: [],
    ARRAY: [],
  }

  const coerce = (value, type) => {
    const re = new RegExp(/{{([^{].*?)}}/g)
    if (re.test(value)) {
      return value
    }

    if (type === "boolean") {
      if (typeof value === "boolean") {
        return value
      }
      return value === "true"
    }
    if (type === "number") {
      if (typeof value === "number") {
        return value
      }
      return Number(value)
    }
    if (type === "options") {
      return [value]
    }
    if (type === "array") {
      if (Array.isArray(value)) {
        return value
      }
      return value.split(",").map(x => x.trim())
    }

    if (type === "link") {
      if (Array.isArray(value)) {
        return value
      }

      return [value]
    }

    return value
  }

  const onChange = (e, field, type) => {
    value[field] = coerce(e.detail, type)
    dispatch("change", value)
  }
</script>

{#if schemaFields.length && isTestModal}
  <div class="schema-fields">
    {#each schemaFields as [field, schema]}
      <RowSelectorTypes
        {isTestModal}
        {field}
        {schema}
        {bindings}
        {value}
        {onChange}
      />
    {/each}
  </div>
{/if}

<style>
  .schema-fields {
    display: grid;
    grid-gap: var(--spacing-s);
    margin-top: var(--spacing-s);
  }
  .schema-fields :global(label) {
    text-transform: capitalize;
  }
</style>
