<script>
  import { Button, TextArea, notifications } from "@budibase/bbui"
  import Spinner from "components/common/Spinner.svelte"
  import { goto } from "@roxi/routify"
  import store from "./aiStore"
  import { datasources, tables } from "stores/builder"
  import KeyValueBuilder from "components/integration/KeyValueBuilder.svelte"
  import { API } from "api"

  export let datasourceId
  export let tableName

  let prompt = ""
  let schema
  let loading

  async function generateTableSchema() {
    loading = true
    notifications.info("Generating table schema..")
    const table = await API.aiGenerateTableSchema({ prompt, model: $store.model })
    const mappedSchema = {}
    for (let key in table.schema) {
      mappedSchema[key] = table.schema[key].type
    }
    schema = mappedSchema
    await tables.save(table)
    await datasources.fetch()
    await tables.fetch()
    notifications.success(`${table.name} Table generated and saved`)
    $goto(`./data/table/${table._id}`)
    loading = false
  }
</script>

<TextArea label="Prompt" bind:value={prompt} />
{#if schema}
  <KeyValueBuilder object={schema} name="field" headings noAddButton />
{/if}
{#if loading}
  <Spinner size="10" />
{/if}
<Button cta on:click={generateTableSchema}>Generate</Button>
