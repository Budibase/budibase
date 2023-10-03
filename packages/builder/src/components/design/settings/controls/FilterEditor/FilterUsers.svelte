<script>
  import { Select } from "@budibase/bbui"
  import { fetchData } from "@budibase/frontend-core"

  import { API } from "api"

  export let filter

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
</script>

<Select
  autocomplete
  bind:value={filter.value}
  {options}
  getOptionLabel={option => option.email}
  getOptionValue={option => option._id}
/>
