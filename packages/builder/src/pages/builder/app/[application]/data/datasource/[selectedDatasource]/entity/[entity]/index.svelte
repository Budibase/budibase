<script>
  import { params } from "@roxi/routify"
  import { notifications } from "@budibase/bbui"
  import { database, queries } from "stores/backend"
  import api from "builderStore/api"
  import Table from "components/backend/DataTable/Table.svelte"

  let loading = false
  let data = []
  let schema = {}

  async function fetchData() {
    try {
      const query = {
            endpoint: {
              datasourceId: $params.selectedDatasource,
              operation: "READ",
              // table name below
              entityId: $params.entity,
            },
            resource: {
              // fields: ["name", "age"],
            },
            filters: {
              // string: {
              //   name: "John",
              // },
            },
      }
      const response = await api.post(`/api/datasources/query`, query)
      const json = await response.json()
      console.log(json)
    } catch (err) {
      notifications.error("Error fetching data")
      console.error(err)
    }
  }

  // $: selectedQuery = $queries.list.find(
  //   query => query._id === $queries.selected
  // ) || {
  //   datasourceId: $params.selectedDatasource,
  //   parameters: [],
  //   fields: {},
  //   queryVerb: "read",
  // }

  fetchData()
</script>

<section>
  <Table 
    {title}
    {schema}
    {data}
    allowEditing={true}
    {loading}
  />
</section>

<style>
</style>
