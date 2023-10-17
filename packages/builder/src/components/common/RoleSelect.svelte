<script>
  import { Select, FancySelect } from "@budibase/bbui"
  import { roles } from "stores/backend"
  import { licensing } from "stores/portal"

  import { Constants, RoleUtils } from "@budibase/frontend-core"
  import { createEventDispatcher } from "svelte"
  import { capitalise } from "helpers"

  export let value
  export let error
  export let placeholder = null
  export let autoWidth = false
  export let quiet = false
  export let allowPublic = true
  export let allowRemove = false
  export let disabled = false
  export let align
  export let footer = null
  export let allowedRoles = null
  export let allowCreator = false
  export let fancySelect = false

  const dispatch = createEventDispatcher()
  const RemoveID = "remove"

  $: options = getOptions(
    $roles,
    allowPublic,
    allowRemove,
    allowedRoles,
    allowCreator
  )
  const getOptions = (
    roles,
    allowPublic,
    allowRemove,
    allowedRoles,
    allowCreator
  ) => {
    if (allowedRoles?.length) {
      return roles.filter(role => allowedRoles.includes(role._id))
    }
    let newRoles = [...roles]

    if (allowCreator) {
      newRoles = [
        {
          _id: Constants.Roles.CREATOR,
          name: "Creator",
          tag:
            !$licensing.perAppBuildersEnabled &&
            capitalise(Constants.PlanType.BUSINESS),
        },
        ...newRoles,
      ]
    }
    if (allowRemove) {
      newRoles = [
        ...newRoles,
        {
          _id: RemoveID,
          name: "Remove",
        },
      ]
    }
    if (allowPublic) {
      return newRoles
    }
    return newRoles.filter(role => role._id !== Constants.Roles.PUBLIC)
  }

  const getColor = role => {
    if (allowRemove && role._id === RemoveID) {
      return null
    }
    return RoleUtils.getRoleColour(role._id)
  }

  const getIcon = role => {
    if (allowRemove && role._id === RemoveID) {
      return "Close"
    }
    return null
  }

  const onChange = e => {
    if (allowRemove && e.detail === RemoveID) {
      dispatch("remove")
    } else {
      dispatch("change", e.detail)
    }
  }
</script>

{#if fancySelect}
  <FancySelect
    {autoWidth}
    {quiet}
    {disabled}
    {align}
    {footer}
    bind:value
    on:change={onChange}
    {options}
    label="Access on this app"
    getOptionLabel={role => role.name}
    getOptionValue={role => role._id}
    getOptionColour={getColor}
    getOptionIcon={getIcon}
    isOptionEnabled={option =>
      option._id !== Constants.Roles.CREATOR ||
      $licensing.perAppBuildersEnabled}
    {placeholder}
    {error}
  />
{:else}
  <Select
    {autoWidth}
    {quiet}
    {disabled}
    {align}
    {footer}
    bind:value
    on:change={onChange}
    {options}
    getOptionLabel={role => role.name}
    getOptionValue={role => role._id}
    getOptionColour={getColor}
    getOptionIcon={getIcon}
    isOptionEnabled={option =>
      option._id !== Constants.Roles.CREATOR ||
      $licensing.perAppBuildersEnabled}
    {placeholder}
    {error}
  />
{/if}
