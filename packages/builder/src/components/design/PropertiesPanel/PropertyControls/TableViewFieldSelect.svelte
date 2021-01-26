<script>
  import OptionSelect from "./OptionSelect.svelte"
  import MultiOptionSelect from "./MultiOptionSelect.svelte"
  import {
    getDatasourceForProvider,
    getSchemaForDatasource,
  } from "builderStore/dataBinding"

  export let componentInstance = {}
  export let value = ""
  export let onChange = () => {}
  export let multiselect = false

  $: datasource = getDatasourceForProvider(componentInstance)
  $: schema = getSchemaForDatasource(datasource).schema
  $: options = Object.keys(schema || {})
</script>

{#if multiselect}
  <MultiOptionSelect {value} {onChange} {options} />
{:else}
  <OptionSelect {value} {onChange} {options} />
{/if}
