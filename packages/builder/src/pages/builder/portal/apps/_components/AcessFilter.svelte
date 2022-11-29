<script>
  import { PickerDropdown } from "@budibase/bbui"
  import { groups } from "stores/portal"
  import { createEventDispatcher } from "svelte"

  const dispatch = createEventDispatcher()

  let filter = null
  $: filteredGroups = !filter
    ? $groups
    : $groups.filter(group =>
        group.name?.toLowerCase().includes(filter.toLowerCase())
      )

  $: optionSections = {
    groups: {
      data: filteredGroups,
      getLabel: group => group.name,
      getValue: group => group._id,
      getIcon: group => group.icon,
      getColour: group => group.color,
    },
  }

  $: onChange = selected => {
    const { detail } = selected
    if (!detail || Object.keys(detail).length == 0) {
      dispatch("change", null)
      return
    }

    const groupSelected = $groups.find(x => x._id === detail)
    const appRoleIds = groupSelected?.roles
      ? Object.keys(groupSelected?.roles)
      : []
    dispatch("change", appRoleIds)
  }
</script>

<PickerDropdown
  autocomplete
  bind:searchTerm={filter}
  primaryOptions={optionSections}
  placeholder={"Filter by access"}
  on:pickprimary={onChange}
  on:closed={() => {
    filter = null
  }}
/>
