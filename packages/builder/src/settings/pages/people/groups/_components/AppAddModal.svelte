<script>
  import {
    Body,
    Layout,
    ModalContent,
    Multiselect,
    Select,
    keepOpen,
    notifications,
  } from "@budibase/bbui"
  import GlobalRoleSelect from "@/components/common/GlobalRoleSelect.svelte"
  import { roles } from "@/stores/builder"
  import { appsStore } from "@/stores/portal/apps"
  import { groups } from "@/stores/portal/groups"
  import { Constants } from "@budibase/frontend-core"
  import GroupIcon from "./GroupIcon.svelte"

  export let groupId

  const workspaceRoleOptions = Constants.BudibaseRoleOptions.filter(
    option =>
      option.value === Constants.BudibaseRoles.Creator ||
      option.value === Constants.BudibaseRoles.AppUser
  )

  let selectedWorkspaceIds = []
  let selectedRole = Constants.BudibaseRoles.AppUser
  let selectedEndUserRole = Constants.Roles.BASIC
  let workspaceSearchTerm = ""

  $: group = $groups.find(x => x._id === groupId)
  $: roleColorLookup = ($roles || []).reduce((acc, role) => {
    acc[role._id] = role.uiMetadata?.color
    return acc
  }, {})
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
  ]
  $: assignedWorkspaceIds = groups.getGroupAppIds(group)
  $: workspaceOptions = Object.values(
    $appsStore.apps.reduce((acc, app) => {
      const prodAppId = appsStore.getProdAppID(app.devId)
      if (assignedWorkspaceIds.includes(prodAppId) || acc[prodAppId]) {
        return acc
      }
      acc[prodAppId] = {
        label: app.name,
        value: prodAppId,
      }
      return acc
    }, {})
  ).sort((a, b) => a.label.localeCompare(b.label))
  $: validOptionIds = workspaceOptions.map(option => option.value)
  $: selectedWorkspaceIdsForSubmit = selectedWorkspaceIds.filter(id =>
    validOptionIds.includes(id)
  )
  $: confirmDisabled =
    !selectedWorkspaceIdsForSubmit.length ||
    (selectedRole === Constants.BudibaseRoles.AppUser && !selectedEndUserRole)

  export function reset() {
    selectedWorkspaceIds = []
    selectedRole = Constants.BudibaseRoles.AppUser
    selectedEndUserRole = Constants.Roles.BASIC
    workspaceSearchTerm = ""
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
      await groups.addApps(
        groupId,
        selectedWorkspaceIdsForSubmit,
        getWorkspaceRole()
      )
      reset()
    } catch (error) {
      notifications.error("Error assigning workspaces")
      return keepOpen
    }
  }
</script>

<ModalContent
  {onConfirm}
  size="M"
  title="Assign workspaces"
  confirmText="Assign"
  disabled={confirmDisabled}
>
  <Layout noPadding gap="S">
    <div class="group-name">
      <GroupIcon {group} size="S" />
      <Body><b>{group?.name}</b></Body>
    </div>
    <Multiselect
      bind:value={selectedWorkspaceIds}
      bind:searchTerm={workspaceSearchTerm}
      label="Workspaces"
      options={workspaceOptions}
      getOptionLabel={option => option.label}
      getOptionValue={option => option.value}
      placeholder={workspaceOptions.length
        ? "Select workspaces"
        : "No available workspaces"}
      searchPlaceholder="Search workspace"
      autocomplete
    />
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

<style>
  .group-name {
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
  }
</style>
