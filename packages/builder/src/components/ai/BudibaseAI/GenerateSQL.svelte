<script>
  import { Button, TextArea, MenuItem, Body } from "@budibase/bbui"
  import Spinner from "components/common/Spinner.svelte"
  import store from "./aiStore"
  import { tables } from "stores/builder"
  import TableSelect from "components/design/settings/controls/TableSelect.svelte"
  import KeyValueBuilder from "components/integration/KeyValueBuilder.svelte"
  import { API } from "api"

  export let datasourceId
  export let tableName

  let mappedSchema
  let loading

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
    loading = true
    const sql = await API.aiGenerateSQL({ prompt, model: $store.model, datasourceId, tableName })
    query = sql.response
    loading = false
  }
</script>

<TableSelect on:change={updateTable} />
<TextArea label="Prompt" bind:value={prompt} />
{#if mappedSchema}
  <KeyValueBuilder object={mappedSchema} name="field" headings noAddButton />
{/if}

{#if loading}
  <Spinner size="10" />
{:else}
  <code>{query}</code>
{/if}
<Button cta on:click={generateSQL}>Generate</Button>