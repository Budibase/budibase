<script>
  import { onMount } from "svelte"
  import { params } from "@sveltech/routify"
  import { backendUiStore } from "builderStore"
  import api from "../../../../../../../../builderStore/api"

  console.log($params)
  let data

  onMount(async () => {
    const QUERY_VIEW_URL = `/api/${$params.selectedModel}/${$params.selectedRecord}/enrich`
    const response = await api.get(QUERY_VIEW_URL)
    data = await response.json()
    console.log(data)
  })
</script>

<div>hello world!</div>
