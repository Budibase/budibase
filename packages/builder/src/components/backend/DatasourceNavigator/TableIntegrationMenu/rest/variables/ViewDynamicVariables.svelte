<script>
  import { Body, Table } from "@budibase/bbui"
  import { queries as queriesStore } from "stores/backend"
  import { goto } from "@roxi/routify"

  export let datasource
  export let queries

  let dynamicVariables = []

  $: enrichDynamicVariables(datasource, queries)

  const dynamicVariableSchema = {
    name: "",
    value: "",
    query: "",
  }

  const onClick = dynamicVariable => {
    const queryId = dynamicVariable.queryId
    queriesStore.select({ _id: queryId })
    $goto(`./${queryId}`)
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

<Table
  on:click={({ detail }) => onClick(detail)}
  schema={dynamicVariableSchema}
  data={dynamicVariables}
  allowEditColumns={false}
  allowEditRows={false}
  allowSelectRows={false}
/>
<Body size="S" />
