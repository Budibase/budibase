<script>
  import KeyValueBuilder from "../KeyValueBuilder.svelte"
  import { SchemaTypeOptions } from "constants/backend"

  export let schema
  export let onSchemaChange = () => {}

  const handleChange = e => {
    let newSchema = {}

    // KeyValueBuilder on change event returns an array of objects containing the updated object
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
    options={SchemaTypeOptions}
  />
{/key}
