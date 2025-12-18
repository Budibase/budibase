<script>
  import { Input, Select, Button } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"

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

  let fields = []
  let initialized = false
  let lastValueRef = null

  $: if (!initialized || value !== lastValueRef) {
    fields = Object.entries(value || {}).map(([name, type]) => ({ name, type }))
    initialized = true
    lastValueRef = value
  }

  function addField() {
    fields = [...fields, { name: "", type: "string" }]
  }

  function removeField(idx) {
    const removed = fields[idx]
    fields = fields.filter((_, i) => i !== idx)
    if ((removed?.name || "").trim()) {
      const update = {}
      for (const f of fields) {
        const name = (f.name || "").trim()
        if (name) update[name] = f.type || "string"
      }
      dispatch("change", update)
    }
  }

  const fieldNameChanged = idx => e => {
    const newName = (e.detail || "").trim()
    const hadName = (fields[idx]?.name || "").trim()
    const copy = [...fields]
    if (newName) {
      copy[idx] = { ...copy[idx], name: newName }
      fields = copy
      const update = {}
      for (const f of fields) {
        const name = (f.name || "").trim()
        if (name) update[name] = f.type || "string"
      }
      dispatch("change", update)
    } else {
      fields = copy.filter((_, i) => i !== idx)
      if (hadName) {
        const update = {}
        for (const f of fields) {
          const name = (f.name || "").trim()
          if (name) update[name] = f.type || "string"
        }
        dispatch("change", update)
      }
    }
  }

  const typeChanged = idx => e => {
    const newType = e.detail
    fields = fields.map((f, i) => (i === idx ? { ...f, type: newType } : f))
    if ((fields[idx]?.name || "").trim()) {
      const update = {}
      for (const f of fields) {
        const name = (f.name || "").trim()
        if (name) update[name] = f.type || "string"
      }
      dispatch("change", update)
    }
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="root">
  <div class="spacer" />
  {#each fields as field, idx}
    <div class="field">
      <Input
        value={field.name}
        secondary
        placeholder="Enter field name"
        on:change={fieldNameChanged(idx)}
        updateOnChange={false}
      />
      <Select
        value={field.type}
        on:change={typeChanged(idx)}
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
  <Button quiet secondary icon="plus" on:click={addField}>Add field</Button>
</div>

<style>
  .root {
    max-width: 100%;
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
