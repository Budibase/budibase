<script>
  import { Combobox } from "@budibase/bbui"
  import { selectedScreen } from "@/stores/builder"
  import { getComponentFieldOptions } from "@/helpers/formFields"

  export let componentInstance
  export let value
  export let type

  $: options = getComponentFieldOptions(
    $selectedScreen?.props,
    componentInstance?._id,
    type
  )
</script>

<Combobox on:change {value} {options} />
