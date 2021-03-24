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
  export let placeholder

  $: datasource = getDatasourceForProvider($currentAsset, componentInstance)
  $: schema = getSchemaForDatasource(datasource).schema
  $: options = Object.keys(schema || {})
</script>

{#if multiselect}
  <MultiOptionSelect {value} {onChange} {options} {placeholder} />
{:else}
  <OptionSelect {value} {onChange} {options} {placeholder} />
{/if}
