<script>
  import { params } from "@roxi/routify"
  import { database } from "stores/backend"
  import QueryInterface from "components/integration/QueryViewer.svelte"

  $: query = {
    datasourceId: $params.datasourceId,
    parameters: [],
    fields: {},
    queryVerb: "read",
  }
</script>

<section>
  <div class="inner">
    {#if $database._id && query}
      <QueryInterface {query} />
    {/if}
  </div>
</section>

<style>
  .inner {
    width: 640px;
    margin: 0 auto;
  }
</style>
