<script>
  import { Combobox } from "@budibase/bbui"
  import { currentAsset } from "builderStore"
  import { getComponentFieldOptions } from "helpers/formFields"

  export let componentInstance
  export let value
  export let type

  $: options = getComponentFieldOptions(
    $currentAsset?.props,
    componentInstance?._id,
    type
  )
</script>

<Combobox
  on:change
  {value}
  valueDisplay={Array.isArray(value) ? value[0] : null}
  {options}
  getOptionLabel={option => option[0]}
  getOptionValue={option => option}
/>
