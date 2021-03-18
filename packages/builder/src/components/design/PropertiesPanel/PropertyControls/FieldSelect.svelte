<script>
  import OptionSelect from "./OptionSelect.svelte"
  import MultiOptionSelect from "./MultiOptionSelect.svelte"
  import {
    getDatasourceForProvider,
    getSchemaForDatasource,
  } from "builderStore/dataBinding"
  import { currentAsset } from "builderStore"

  export let componentInstance = {}
  export let value = ""
  export let onChange = () => {}
  export let multiselect = false

  $: datasource = getDatasourceForProvider($currentAsset, componentInstance)
  $: schema = getSchemaForDatasource(datasource).schema
  $: options = Object.keys(schema || {})
</script>

{#if multiselect}
  <MultiOptionSelect {value} {onChange} {options} />
{:else}
  <OptionSelect {value} {onChange} {options} />
{/if}
