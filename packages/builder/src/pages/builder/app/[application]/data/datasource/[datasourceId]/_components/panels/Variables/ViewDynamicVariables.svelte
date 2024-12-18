<script>
  import { Body, Table, BoldRenderer, CodeRenderer } from "@budibase/bbui"
  import { queries } from "@/stores/builder"
  import { goto } from "@roxi/routify"

  export let datasource

  let dynamicVariables = []

  $: enrichDynamicVariables(datasource, $queries.list)

  const dynamicVariableSchema = {
    name: "",
    query: "",
    value: "",
  }

  const onClick = dynamicVariable => {
    const queryId = dynamicVariable.queryId
    queries.select({ _id: queryId })
    $goto(`../../query/${queryId}`)
  }

  /**
   * Add the query name to the dynamic variables
   */
  function enrichDynamicVariables(ds, possibleQueries) {
    dynamicVariables = []
    ds.config.dynamicVariables?.forEach(dv => {
      const query = possibleQueries.find(query => query._id === dv.queryId)
      if (query) {
        dynamicVariables.push({ ...dv, query: query.name })
      }
    })
  }
</script>

{#if dynamicVariables && dynamicVariables.length > 0}
  <Table
    on:click={({ detail }) => onClick(detail)}
    schema={dynamicVariableSchema}
    data={dynamicVariables}
    allowEditColumns={false}
    allowEditRows={false}
    allowSelectRows={false}
    customRenderers={[
      { column: "name", component: BoldRenderer },
      { column: "value", component: CodeRenderer },
    ]}
  />
{:else}
  <Body size="S"><i>No dynamic variables specified.</i></Body>
{/if}
