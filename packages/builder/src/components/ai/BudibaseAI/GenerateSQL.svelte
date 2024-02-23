<script>
  import { Button, TextArea, MenuItem, Body } from "@budibase/bbui"
  import TableSelect from "components/design/settings/controls/TableSelect.svelte"
  import { API } from "api"
  import Editor from "components/integration/QueryEditor.svelte"

  export let datasourceId
  export let tableName

  let query = ""
  let prompt = ""

  function updateTable(evt) {
    const { resourceId, label } = evt.detail
    // TODO: this isn't actually the datasourceID. Need to pick that or parse it
    datasourceId = resourceId
    tableName = label
  }

  async function generateSQL() {
    const sql = await API.aiGenerateSQL({ prompt, model: "ChatGPT", datasourceId, tableName })
    query = sql.response
  }
</script>

<TableSelect on:change={updateTable} />
<TextArea label="Prompt" bind:value={prompt} />
<Body>{query}</Body>
<Button cta on:click={generateSQL}>Generate</Button>