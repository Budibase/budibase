<script>
  import { Body, Button, Layout, notifications } from "@budibase/bbui"
  import Panel from "./Panel.svelte"
  import { API } from "api"
  import { downloadText } from "@budibase/frontend-core"

  export let datasource

  async function download() {
    if (!datasource?._id) {
      notifications.error("Datasource invalid")
    }
    const response = await API.fetchExternalSchema(datasource._id)
    downloadText(`${datasource.name}-dump.sql`, response.schema)
  }
</script>

<Panel>
  <div class="main">
    <Layout gap="S" noPadding>
      <Body size="L" weight="700">Troubleshooting</Body>
      <Body>Download your schema to share with the Budibase team</Body>
      <div class="download-button">
        <Button cta on:click={download}>Download</Button>
      </div>
    </Layout>
  </div>
</Panel>

<style>
  .main {
    margin-top: calc(var(--spacing-l) * -1);
  }

  .download-button {
    padding-top: var(--spacing-s);
  }
</style>
