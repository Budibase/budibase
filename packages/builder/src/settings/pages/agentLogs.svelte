<script>
  import { Layout, Body, Button } from "@budibase/bbui"
  import { downloadStream } from "@budibase/frontend-core"
  import Spinner from "@/components/common/Spinner.svelte"

  import { API } from "@/api"

  let loading = false

  async function download() {
    loading = true
    try {
      await downloadStream(await API.getSystemLogs())
    } finally {
      loading = false
    }
  }
</script>

<Layout noPadding>
  <Body size="S">Download your latest logs to share with the Budibase team</Body
  >
</Layout>
