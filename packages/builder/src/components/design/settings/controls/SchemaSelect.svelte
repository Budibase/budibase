<script>
  import DataSourceSelect from "./DataSourceSelect.svelte"

  const otherSources = [{ name: "Custom", label: "Custom" }]
</script>

<DataSourceSelect
  on:change
  {...$$props}
  showAllQueries={true}
  showDataProviders={false}
  {otherSources}
/>
