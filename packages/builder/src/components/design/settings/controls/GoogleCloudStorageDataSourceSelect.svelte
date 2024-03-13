<script>
  import { Select } from "@budibase/bbui"
  import { datasources } from "stores/builder"

  export let value = null

  $: gcDataSources = $datasources.list
    .filter(ds => ds.source === "GOOGLE_CLOUD")
    .map(ds => ({
      label: ds.name,
      value: ds._id,
    }))
</script>

<Select options={gcDataSources} {value} on:change />
