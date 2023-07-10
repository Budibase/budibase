<script>
  import { Layout, Body, Button } from "@budibase/bbui"
  import { downloadStream } from "@budibase/frontend-core"

  import { API } from "api"

  async function download() {
    downloadStream(await API.getServerLogs())
  }
</script>

<Layout noPadding>
  <Body>Download your latest logs to share with the Budibase team</Body>
  <div class="download-button">
    <Button cta on:click={download}>Download system logs</Button>
  </div>
</Layout>
