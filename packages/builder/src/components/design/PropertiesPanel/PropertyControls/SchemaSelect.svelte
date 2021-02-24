<script>
  import DatasourceSelect from "./DatasourceSelect.svelte"

  const otherSources = [{ name: "Custom", label: "Custom" }]
</script>

<DatasourceSelect on:change {...$$props} showAllQueries={true} {otherSources} />
