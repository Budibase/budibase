<script>
  import DataSourceSelect from "./DataSourceSelect.svelte"
  import { _ as t } from "svelte-i18n"

  const otherSources = [{ name: "Custom", label: $t("custom") }]
</script>

<DataSourceSelect on:change {...$$props} showAllQueries={true} {otherSources} />
