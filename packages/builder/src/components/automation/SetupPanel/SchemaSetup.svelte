<script>
  import { Input, Select, Button } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"
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

  // Maintain stable IDs for fields keyed by name
  let idByName = new Map()
  let fieldsFromValue = []
  let extraFields = [] // fields not yet committed (no name)

  // Rebuild fields from incoming value while preserving IDs
  $: {
    const next = []
    const nextIdByName = new Map()
    for (const [name, type] of Object.entries(value || {})) {
      const id = idByName.get(name) || generate()
      next.push({ id, name, type })
      nextIdByName.set(name, id)
    }
    fieldsFromValue = next
    idByName = nextIdByName
  }

  // Combined fields for rendering
  $: fieldsArray = [...fieldsFromValue, ...extraFields]

  function addField() {
    extraFields = [...extraFields, { id: generate(), name: "", type: "string" }]
  }

  function removeField(idx) {
    const field = fieldsArray[idx]
    if (!field) return

    // Remove empty/uncommitted field locally
    if (!field.name) {
      extraFields = extraFields.filter(f => f.id !== field.id)
      return
    }

    // Remove committed field and notify parent
    const update = { ...value }
    delete update[field.name]
    dispatch("change", update)
  }

  const fieldNameChanged = field => e => {
    const newName = (e.detail || "").trim()

    // If cleared, remove field
    if (!newName) {
      if (!field.name) {
        // was an extra field
        extraFields = extraFields.filter(f => f.id !== field.id)
        return
      }
      const update = { ...value }
      delete update[field.name]
      dispatch("change", update)
      return
    }

    // Renaming or creating a new named field
    const update = { ...value }
    const type = field.type || "string"

    // If it existed under a different name, remove old key
    if (field.name && field.name !== newName) {
      delete update[field.name]
    } else if (!field.name) {
      // was an extra field, remove local placeholder
      extraFields = extraFields.filter(f => f.id !== field.id)
    }

    update[newName] = type
    dispatch("change", update)
  }

  const typeChanged = field => e => {
    const newType = e.detail
    if (!field.name) {
      // Update local extra field type until it has a name
      extraFields = extraFields.map(f => (f.id === field.id ? { ...f, type: newType } : f))
      return
    }
    const update = { ...value, [field.name]: newType }
    dispatch("change", update)
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
        on:change={fieldNameChanged(field)}
        updateOnChange={false}
      />
      <Select value={field.type} on:change={typeChanged(field)} options={typeOptions} />
      <i
        class="remove-field ri-delete-bin-line"
        on:click={() => {
          removeField(idx)
        }}
      />
    </div>
  {/each}
  <Button quiet secondary icon="plus" on:click={addField}>Add field</Button>
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
