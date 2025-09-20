<script lang="ts">
  import { capitalise } from "@/helpers"
  import { roles } from "@/stores/builder"
  import { licensing } from "@/stores/portal"
  import type { PopoverAlignment } from "@budibase/bbui"
  import { FancySelect, Select } from "@budibase/bbui"
  import { Constants } from "@budibase/frontend-core"
  import type { UIRole } from "@budibase/types"
  import { createEventDispatcher } from "svelte"

  interface RoleOption {
    _id: string
    name: string
    color?: string
    enabled?: boolean
    tag?: string | null
  }

  export let value: string | undefined = undefined
  export let error: string | undefined = undefined
  export let placeholder: string | boolean = false
  export let autoWidth: boolean = false
  export let quiet: boolean = false
  export let allowPublic: boolean = true
  export let allowRemove: boolean = false
  export let disabled: boolean = false
  export let align: PopoverAlignment | undefined = undefined
  export let footer: string | undefined = undefined
  export let allowedRoles: string[] | null = null
  export let allowCreator: boolean = false
  export let fancySelect: boolean = false
  export let labelPrefix: string | null = null

  const dispatch = createEventDispatcher()
  const RemoveID = "remove"
  const subType = $licensing.license?.plan?.type ?? null

  $: isPremiumOrAbove = [
    Constants.PlanType.PREMIUM,
    Constants.PlanType.PREMIUM_PLUS,
    Constants.PlanType.ENTERPRISE,
    Constants.PlanType.ENTERPRISE_BASIC_TRIAL,
    // @ts-expect-error this is not in the enum anymore, but it might be in some licences
    Constants.PlanType.ENTERPRISE_BASIC,
  ].includes(subType)

  $: enrichLabel = (label: string) =>
    labelPrefix ? `${labelPrefix} ${label}` : label
  $: options = getOptions(
    $roles,
    allowPublic,
    allowRemove,
    allowedRoles,
    allowCreator,
    enrichLabel
  )

  const getOptions = (
    roles: UIRole[],
    allowPublic: boolean,
    allowRemove: boolean,
    allowedRoles: string[] | null,
    allowCreator: boolean,
    enrichLabel: (_label: string) => string
  ): RoleOption[] => {
    // Use roles whitelist if specified
    if (allowedRoles?.length) {
      let options: RoleOption[] = roles
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
    let options = roles.map<RoleOption>(role => ({
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

  const getColor = (role: RoleOption) => {
    // Creator and remove options have no colors
    if (role._id === Constants.Roles.CREATOR || role._id === RemoveID) {
      return null
    }
    return role.color || "var(--spectrum-global-color-static-magenta-400)"
  }

  const getIcon = (role: RoleOption) => {
    // Only remove option has an icon
    if (role._id === RemoveID) {
      return "Close"
    }
    return null
  }

  const onChange = (e: CustomEvent) => {
    if (allowRemove && e.detail === RemoveID) {
      dispatch("remove")
    } else {
      dispatch("change", e.detail)
    }
  }
</script>

{#if fancySelect}
  <FancySelect
    {disabled}
    {footer}
    bind:value
    on:change={onChange}
    {options}
    label="Access on this app"
    getOptionLabel={role => role.name}
    getOptionValue={role => role._id}
    getOptionColour={getColor}
    isOptionEnabled={option => {
      if (option._id === Constants.Roles.CREATOR) {
        return isPremiumOrAbove
      }
      return true
    }}
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
