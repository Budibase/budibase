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

  $: component = multiselect ? Multiselect : Select
</script>

<svelte:component
  this={component}
  bind:value
  autocomplete
  {options}
  getOptionLabel={option => option.email}
  getOptionValue={option => option._id}
  {disabled}
/>
