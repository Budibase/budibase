<script>
  import { Select } from "@budibase/bbui"
  import { makePropSafe } from "@budibase/string-templates"
  import { selectedScreen } from "@/stores/builder"
  import { findAllMatchingComponents } from "@/helpers/components"

  export let value

  const getValue = component => `{{ literal ${makePropSafe(component._id)} }}`

  $: providers = findAllMatchingComponents($selectedScreen?.props, c =>
    c._component?.endsWith("/dataprovider")
  )
</script>

<Select
  {value}
  placeholder={null}
  on:change
  options={providers}
  getOptionLabel={component => component._instanceName}
  getOptionValue={getValue}
/>
