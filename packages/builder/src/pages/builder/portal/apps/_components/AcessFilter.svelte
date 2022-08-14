<script>
  import { PickerDropdown, notifications } from "@budibase/bbui"
  import { groups } from "stores/portal"
  import { onMount, createEventDispatcher } from "svelte"

  const dispatch = createEventDispatcher()

  $: optionSections = {
    groups: {
      data: $groups,
      getLabel: group => group.name,
      getValue: group => group._id,
      getIcon: group => group.icon,
      getColour: group => group.color,
    },
  }

  $: appData = [{ id: "", role: "" }]

  $: onChange = selected => {
    const { detail } = selected
    if (!detail) return

    const groupSelected = $groups.find(x => x._id === detail)
    const appIds = groupSelected?.apps.map(x => x.appId) || null
    dispatch("change", appIds)
  }

  onMount(async () => {
    try {
      await groups.actions.init()
    } catch (error) {
      notifications.error("Error")
    }
  })
</script>

<PickerDropdown
  autocomplete
  primaryOptions={optionSections}
  placeholder={"Filter by access"}
  on:pickprimary={onChange}
/>
