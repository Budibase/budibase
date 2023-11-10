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

<Combobox on:change {value} {options} />
