<script>
  import { Select } from "@budibase/bbui"
  import { datasources } from "stores/backend"

  export let value = null

  $: dataSources = $datasources.list
    .filter(ds => ds.source === "S3" && !ds.config?.endpoint)
    .map(ds => ({
      label: ds.name,
      value: ds._id,
    }))
</script>

<Select options={dataSources} {value} on:change />
