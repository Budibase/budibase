<script>
  import { Button } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"
  import SchemaFieldRow from "@/components/common/SchemaFieldRow.svelte"

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

  const fieldNameChanged = idx => value => {
    const newName = (value || "").trim()
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

  const typeChanged = idx => newType => {
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

<div class="root">
  <div class="spacer"></div>
  {#each fields as field, idx}
    <div class="field">
      <SchemaFieldRow
        name={field.name}
        type={field.type}
        options={typeOptions}
        removeLabel={`Remove field ${idx + 1}`}
        onNameChange={fieldNameChanged(idx)}
        onTypeChange={typeChanged(idx)}
        onRemove={() => removeField(idx)}
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
    margin-bottom: var(--spacing-m);
  }
</style>
