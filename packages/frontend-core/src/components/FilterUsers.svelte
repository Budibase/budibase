<script>
  import { Select, Multiselect } from "@budibase/bbui"
  import {
    fetchData,
    fetchUsersById,
    loadTranslationsByGroup,
    Utils,
  } from "@budibase/frontend-core"
  import { createAPIClient } from "../api"

  export let API = createAPIClient()

  /** @type {string | string[] | null} */
  export let value = null
  export let disabled = false
  export let multiselect = false

  let searchTerm = null
  let appliedTerm = ""
  let selectedCache = {}
  let loadingIds = new Set()

  $: fetch = fetchData({
    API,
    datasource: {
      type: "user",
    },
    options: {
      limit: 100,
    },
  })

  $: search(searchTerm || "")
  $: selectedIds = !value ? [] : Array.isArray(value) ? value : [value]
  $: pageIds = new Set(($fetch.rows || []).map(user => user._id))
  $: loadMissing(
    selectedIds.filter(id => !pageIds.has(id) && !selectedCache[id])
  )
  $: options = sortSelectedFirst(
    [
      ...($fetch.rows || []),
      ...Object.values(selectedCache).filter(
        user => selectedIds.includes(user._id) && !pageIds.has(user._id)
      ),
    ],
    selectedIds
  )

  $: component = multiselect ? Multiselect : Select
  const pickerLabels = loadTranslationsByGroup("picker")

  const search = Utils.debounce(term => {
    if (term === appliedTerm) {
      return
    }
    appliedTerm = term
    fetch.update({ query: term ? { string: { email: term } } : {} })
  }, 250)

  const loadMissing = async ids => {
    const wanted = ids.filter(id => !loadingIds.has(id))
    if (!wanted.length) {
      return
    }
    wanted.forEach(id => loadingIds.add(id))
    const users = await fetchUsersById(API, wanted)
    wanted.forEach(id => loadingIds.delete(id))
    if (Object.keys(users).length) {
      selectedCache = { ...selectedCache, ...users }
    }
  }

  const sortSelectedFirst = (users, ids) => {
    const selected = new Set(ids)
    return [...users].sort((a, b) => {
      const aSelected = selected.has(a._id)
      const bSelected = selected.has(b._id)
      if (aSelected !== bSelected) {
        return aSelected ? -1 : 1
      }
      return (a.email || "").localeCompare(b.email || "")
    })
  }
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
    popoverAutoWidth
    bind:searchTerm
  />
</div>
