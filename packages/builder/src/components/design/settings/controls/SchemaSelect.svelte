<script>
  import { _ } from "../../../../../lang/i18n"
  import DataSourceSelect from "./DataSourceSelect.svelte"

  const otherSources = [
    {
      name: "Custom",
      label: $_("components.design.settings.controls.SchemaSelect.Custom"),
    },
  ]
</script>

<DataSourceSelect
  on:change
  {...$$props}
  showAllQueries={true}
  showDataProviders={false}
  {otherSources}
/>
