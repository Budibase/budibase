<script>
  import { Select, Multiselect } from "@budibase/bbui"
  import { fetchData, loadTranslationsByGroup } from "@budibase/frontend-core"
  import { createAPIClient } from "../api"

  export let API = createAPIClient()

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
  const pickerLabels = loadTranslationsByGroup("picker")
</script>

<div class="user-control">
  <svelte:component
    this={component}
    {value}
    on:change
    autocomplete
    {options}
    getOptionLabel={option => option.email}
    getOptionValue={option => option._id}
    {disabled}
    searchPlaceholder={pickerLabels.searchPlaceholder}
  />
</div>
