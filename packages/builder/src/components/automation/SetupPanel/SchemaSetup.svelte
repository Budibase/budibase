<script>
  import { Input, Select, Button } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"
  import { memo } from "@budibase/frontend-core"
  import { generate } from "shortid"

  export let value = {}

  const typeOptions = [
    {
      label: "Text",
      value: "string",
    },
    {
      label: "Number",
      value: "number",
    },
    {
      label: "Boolean",
      value: "boolean",
    },
    {
      label: "DateTime",
      value: "datetime",
    },
    {
      label: "Array",
      value: "array",
    },
  ]

  const dispatch = createEventDispatcher()
  const memoValue = memo({ data: {} })

  $: memoValue.set({ data: value })

  $: fieldsArray = $memoValue.data
    ? Object.entries($memoValue.data).map(([name, type]) => ({
        name,
        type,
        id: generate(),
      }))
    : []

  function addField() {
    const newValue = { ...$memoValue.data }
    newValue[""] = "string"
    fieldsArray = [...fieldsArray, { name: "", type: "string", id: generate() }]
  }

  function removeField(idx) {
    const entries = [...fieldsArray]

    // Remove empty field
    if (!entries[idx]?.name) {
      fieldsArray.splice(idx, 1)
      fieldsArray = [...fieldsArray]
      return
    }

    entries.splice(idx, 1)

    const update = entries.reduce((newVals, current) => {
      newVals[current.name.trim()] = current.type
      return newVals
    }, {})
    dispatch("change", update)
  }

  const fieldNameChanged = originalName => e => {
    // reconstruct using fieldsArray, so field order is preserved
    let entries = [...fieldsArray]
    const newName = e.detail
    if (newName) {
      entries.find(f => f.name === originalName).name = newName
    } else {
      entries = entries.filter(f => f.name !== originalName)
    }

    const update = entries
      .filter(entry => entry.name)
      .reduce((newVals, current) => {
        newVals[current.name.trim()] = current.type
        return newVals
      }, {})
    if (Object.keys(update).length) {
      dispatch("change", update)
    }
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="root">
  <div class="spacer" />
  {#each fieldsArray as field, idx (field.id)}
    <div class="field">
      <Input
        value={field.name}
        secondary
        placeholder="Enter field name"
        on:change={fieldNameChanged(field.name)}
        updateOnChange={false}
      />
      <Select
        value={field.type}
        on:change={e => {
          value[field.name] = e.detail
          dispatch("change", value)
        }}
        options={typeOptions}
      />
      <i
        class="remove-field ri-delete-bin-line"
        on:click={() => {
          removeField(idx)
        }}
      />
    </div>
  {/each}
  <Button quiet secondary icon="Add" on:click={addField}>Add field</Button>
</div>

<style>
  .root {
    max-width: 100%;
    /* so we can show the "+" button beside the "fields" label*/
    top: -26px;
  }

  .spacer {
    height: var(--spacing-s);
  }

  .field {
    max-width: 100%;
    margin-bottom: var(--spacing-m);
    display: grid;
    grid-template-columns: 1fr 1fr auto;
    position: relative;
    align-items: center;
    gap: var(--spacing-m);
  }

  .remove-field {
    cursor: pointer;
  }

  .remove-field:hover {
    color: var(--spectrum-global-color-gray-900);
  }
</style>
