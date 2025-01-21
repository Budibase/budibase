<script>
  import { Select } from "@budibase/bbui"
  import { datasources } from "@/stores/builder"

  export let value = null

  $: dataSources = $datasources.list
    .filter(ds => ["S3", "AZURE"].includes(ds.source) && !ds.config?.endpoint)
    .map(ds => ({
      label: ds.name,
      value: ds._id,
    }))
</script>

<Select options={dataSources} {value} on:change />
