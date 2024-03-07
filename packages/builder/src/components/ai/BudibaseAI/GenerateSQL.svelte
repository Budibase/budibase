<script>
  import { Button, TextArea, MenuItem, Body } from "@budibase/bbui"
  import store from "./aiStore"
  import { tables } from "stores/builder"
  import TableSelect from "components/design/settings/controls/TableSelect.svelte"
  import KeyValueBuilder from "components/integration/KeyValueBuilder.svelte"
  import { API } from "api"

  export let datasourceId
  export let tableName

  let mappedSchema

  $: {
    if (tableName) {
      const schema = $tables.list.find(table => table.name === tableName)?.schema
      mappedSchema = Object.keys(schema).reduce((acc, next) => {
        return  {
          ...acc,
          [next]: schema[next].type
        }
      }, {})
    }
  }


  let query = ""
  let prompt = ""

  function updateTable(evt) {
    const { resourceId, label } = evt.detail
    const [dsId] = resourceId.split("__")
    datasourceId = dsId
    tableName = label
  }

  async function generateSQL() {
    const sql = await API.aiGenerateSQL({ prompt, model: $store.model, datasourceId, tableName })
    query = sql.response
  }
</script>

<TableSelect on:change={updateTable} />
<TextArea label="Prompt" bind:value={prompt} />
{#if mappedSchema}
  <KeyValueBuilder object={mappedSchema} name="field" headings noAddButton />
{/if}
<code>{query}</code>
<Button cta on:click={generateSQL}>Generate</Button>