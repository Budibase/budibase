<script>
  import { Select, FancySelect } from "@budibase/bbui"
  import { roles } from "@/stores/builder"
  import { licensing } from "@/stores/portal"

  import { Constants } from "@budibase/frontend-core"
  import { createEventDispatcher } from "svelte"
  import { capitalise } from "@/helpers"

  export let value = undefined
  export let error = undefined
  export let placeholder = null
  export let autoWidth = false
  export let quiet = false
  export let allowPublic = true
  export let allowRemove = false
  export let disabled = false
  export let align = undefined
  export let footer = null
  export let allowedRoles = null
  export let allowCreator = false
  export let fancySelect = false
  export let labelPrefix = null

  const dispatch = createEventDispatcher()
  const RemoveID = "remove"
  const subType = $licensing.license.plan.type ?? null

  $: isPremiumOrAbove = [
    Constants.PlanType.PREMIUM,
    Constants.PlanType.PREMIUM_PLUS,
    Constants.PlanType.ENTERPRISE,
    Constants.PlanType.ENTERPRISE_BASIC_TRIAL,
    Constants.PlanType.ENTERPRISE_BASIC,
  ].includes(subType)

  $: enrichLabel = label => (labelPrefix ? `${labelPrefix} ${label}` : label)
  $: options = getOptions(
    $roles,
    allowPublic,
    allowRemove,
    allowedRoles,
    allowCreator,
    enrichLabel
  )

  const getOptions = (
    roles,
    allowPublic,
    allowRemove,
    allowedRoles,
    allowCreator,
    enrichLabel
  ) => {
    // Use roles whitelist if specified
    if (allowedRoles?.length) {
      let options = roles
        .filter(role => allowedRoles.includes(role._id))
        .map(role => ({
          color: role.uiMetadata.color,
          name: enrichLabel(role.uiMetadata.displayName),
          _id: role._id,
        }))
      if (allowedRoles.includes(Constants.Roles.CREATOR)) {
        options.push({
          _id: Constants.Roles.CREATOR,
          name: "Can edit",
          enabled: false,
        })
      }
      return options
    }

    // Allow all core roles
    let options = roles.map(role => ({
      color: role.uiMetadata.color,
      name: enrichLabel(role.uiMetadata.displayName),
      _id: role._id,
    }))

    // Add creator if required
    if (allowCreator || isPremiumOrAbove) {
      options.unshift({
        _id: Constants.Roles.CREATOR,
        name: "Can edit",
        tag: isPremiumOrAbove ? null : capitalise(Constants.PlanType.PREMIUM),
      })
    }

    // Add remove option if required
    if (allowRemove) {
      options.push({
        _id: RemoveID,
        name: "Remove",
      })
    }

    // Remove public if not allowed
    if (!allowPublic) {
      options = options.filter(role => role._id !== Constants.Roles.PUBLIC)
    }

    return options
  }

  const getColor = role => {
    // Creator and remove options have no colors
    if (role._id === Constants.Roles.CREATOR || role._id === RemoveID) {
      return null
    }
    return role.color || "var(--spectrum-global-color-static-magenta-400)"
  }

  const getIcon = role => {
    // Only remove option has an icon
    if (role._id === RemoveID) {
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
    {footer}
    bind:value
    on:change={onChange}
    {options}
    label="Access on this app"
    getOptionLabel={role => role.name}
    getOptionValue={role => role._id}
    getOptionColour={getColor}
    getOptionIcon={getIcon}
    isOptionEnabled={option => {
      if (option._id === Constants.Roles.CREATOR) {
        return isPremiumOrAbove
      }
      return true
    }}
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
    isOptionEnabled={option => {
      if (option._id === Constants.Roles.CREATOR) {
        return isPremiumOrAbove
      }
      return option.enabled !== false
    }}
    {placeholder}
    {error}
  />
{/if}
