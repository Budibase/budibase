<script>
  import KeyValueBuilder from "../KeyValueBuilder.svelte"
  import { SchemaTypeOptionsExpanded } from "@/constants/backend"

  export let schema
  export let onSchemaChange = () => {}

  const handleChange = e => {
    let newSchema = {}

    // KeyValueBuilder on change event returns an array of objects with each object
    // containing a field
    e.detail.forEach(({ name, value }) => {
      newSchema[name] = value
    })

    onSchemaChange(newSchema)
  }
</script>

{#key schema}
  <KeyValueBuilder
    on:change={handleChange}
    object={schema}
    name="field"
    headings
    options={SchemaTypeOptionsExpanded}
    compare={(option, value) => option.type === value?.type}
  />
{/key}
