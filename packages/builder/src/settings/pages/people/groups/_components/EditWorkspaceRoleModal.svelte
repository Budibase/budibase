<script>
  import {
    Body,
    Layout,
    ModalContent,
    Select,
    keepOpen,
    notifications,
  } from "@budibase/bbui"
  import GlobalRoleSelect from "@/components/common/GlobalRoleSelect.svelte"
  import { API } from "@/api"
  import { groups } from "@/stores/portal/groups"
  import { Constants } from "@budibase/frontend-core"

  export let groupId
  export let workspace
  export let openToken = 0

  const workspaceRoleOptions = Constants.BudibaseRoleOptions.filter(
    option =>
      option.value === Constants.BudibaseRoles.Creator ||
      option.value === Constants.BudibaseRoles.AppUser
  )
  const builtInEndUserRoles = [Constants.Roles.BASIC, Constants.Roles.ADMIN]
  const excludedRoleIds = [
    ...builtInEndUserRoles,
    Constants.Roles.PUBLIC,
    Constants.Roles.POWER,
    Constants.Roles.CREATOR,
    Constants.Roles.GROUP,
  ]

  let selectedRole = Constants.BudibaseRoles.AppUser
  let selectedEndUserRole = Constants.Roles.BASIC
  let workspaceRoles = []
  let workspaceRolesLoaded = false
  let roleRequestId = 0

  $: workspaceId = workspace?.prodAppId
  $: if (workspaceId && openToken) {
    workspaceRolesLoaded = false
    setInitialRoleValues()
    fetchWorkspaceRoles(workspaceId)
  }
  $: if (!workspaceId) {
    workspaceRoles = []
  }
  $: roleColorLookup = workspaceRoles.reduce((acc, role) => {
    acc[role._id] = role.uiMetadata?.color
    return acc
  }, {})
  $: customEndUserRoleOptions = workspaceRoles
    .filter(role => !excludedRoleIds.includes(role._id))
    .map(role => ({
      label: role.uiMetadata?.displayName || role.name || "Custom role",
      value: role._id,
      color:
        role.uiMetadata?.color ||
        "var(--spectrum-global-color-static-magenta-400)",
    }))
  $: endUserRoleOptions = [
    {
      label: "Basic user",
      value: Constants.Roles.BASIC,
      color: roleColorLookup[Constants.Roles.BASIC],
    },
    {
      label: "Admin user",
      value: Constants.Roles.ADMIN,
      color: roleColorLookup[Constants.Roles.ADMIN],
    },
    ...customEndUserRoleOptions,
  ]
  $: if (
    workspaceRolesLoaded &&
    selectedRole === Constants.BudibaseRoles.AppUser &&
    !endUserRoleOptions.find(option => option.value === selectedEndUserRole)
  ) {
    selectedEndUserRole = Constants.Roles.BASIC
  }
  $: confirmDisabled =
    !workspaceId ||
    (selectedRole === Constants.BudibaseRoles.AppUser && !selectedEndUserRole)

  function setInitialRoleValues() {
    if (workspace?.role === Constants.Roles.CREATOR) {
      selectedRole = Constants.BudibaseRoles.Creator
      selectedEndUserRole = Constants.Roles.BASIC
      return
    }
    selectedRole = Constants.BudibaseRoles.AppUser
    selectedEndUserRole = workspace?.role || Constants.Roles.BASIC
  }

  async function fetchWorkspaceRoles(appId) {
    const requestId = ++roleRequestId
    try {
      const response = await API.getRolesForApp(appId)
      if (requestId !== roleRequestId) {
        return
      }
      workspaceRoles = response?.roles || []
    } catch (error) {
      if (requestId !== roleRequestId) {
        return
      }
      workspaceRoles = []
      notifications.error("Error loading workspace roles")
    } finally {
      if (requestId === roleRequestId) {
        workspaceRolesLoaded = true
      }
    }
  }

  const getWorkspaceRole = () => {
    if (selectedRole === Constants.BudibaseRoles.Creator) {
      return Constants.Roles.CREATOR
    }
    return selectedEndUserRole || Constants.Roles.BASIC
  }

  const onConfirm = async () => {
    if (confirmDisabled) {
      return keepOpen
    }
    try {
      await groups.addApp(groupId, workspaceId, getWorkspaceRole())
    } catch (error) {
      notifications.error("Error updating workspace role")
      return keepOpen
    }
  }
</script>

<ModalContent
  {onConfirm}
  size="M"
  title="Edit workspace role"
  confirmText="Save"
  disabled={confirmDisabled}
>
  <Layout noPadding gap="S">
    <Body><b>{workspace?.name}</b></Body>
    <GlobalRoleSelect
      bind:value={selectedRole}
      options={workspaceRoleOptions}
    />
    {#if selectedRole === Constants.BudibaseRoles.AppUser}
      <Select
        label="Select end user role"
        bind:value={selectedEndUserRole}
        options={endUserRoleOptions}
        getOptionLabel={option => option.label}
        getOptionValue={option => option.value}
        getOptionColour={option => option.color}
        placeholder={false}
      />
    {/if}
  </Layout>
</ModalContent>
