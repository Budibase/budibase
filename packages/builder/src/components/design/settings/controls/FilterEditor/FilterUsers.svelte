<script>
  import { Select, Multiselect } from "@budibase/bbui"
  import { fetchData } from "@budibase/frontend-core"

  import { API } from "api"

  export let value = null
  export let disabled
  export let multiselect = false

  $: fetch = fetchData({
    API,
    datasource: {
      type: "user",
    },
    options: {
      limit: 100,
    },
  })

  $: options = $fetch.rows

  function onChange(e) {
    const val = e.detail
    if (!val) {
      value = val
    } else {
      value = Array.isArray(val) ? val : [val]
    }
  }

  $: selectedValue = multiselect || !value ? value : value[0]

  $: component = multiselect ? Multiselect : Select
</script>

<svelte:component
  this={component}
  value={selectedValue}
  autocomplete
  on:change={onChange}
  {options}
  getOptionLabel={option => option.email}
  getOptionValue={option => option._id}
  {disabled}
/>
