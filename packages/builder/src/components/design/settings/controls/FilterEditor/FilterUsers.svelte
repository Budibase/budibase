<script>
  import { Select } from "@budibase/bbui"
  import { fetchData } from "@budibase/frontend-core"

  import { API } from "api"

  export let value = null
  export let multiple = false

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
</script>

<Select
  value={multiple ? value : value[0]}
  autocomplete
  on:change={onChange}
  {options}
  getOptionLabel={option => option.email}
  getOptionValue={option => option._id}
/>
