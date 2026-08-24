<script lang="ts">
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
  import { API } from "@/api"
  import { workspacesStore } from "@/stores/portal/workspaces"
  import { groups } from "@/stores/portal/groups"
  import { Constants } from "@budibase/frontend-core"
  import type { Role } from "@budibase/types"
  import GroupIcon from "./GroupIcon.svelte"

  export let groupId: string

  interface WorkspaceOption {
    label: string
    value: string
  }

  const workspaceRoleOptions = Constants.BudibaseRoleOptions.filter(
    option =>
      option.value === Constants.BudibaseRoles.Creator ||
      option.value === Constants.BudibaseRoles.AppUser
  )
  const excludedRoleIds = [
    Constants.Roles.BASIC,
    Constants.Roles.ADMIN,
    Constants.Roles.PUBLIC,
    Constants.Roles.CREATOR,
    Constants.Roles.GROUP,
  ]

  let selectedWorkspaceIds: string[] = []
  let selectedRole = Constants.BudibaseRoles.AppUser
  let selectedEndUserRole = Constants.Roles.BASIC
  let workspaceSearchTerm = ""
  let workspaceRoles: Role[] = []
  let roleRequestId = 0

  $: group = $groups.find(x => x._id === groupId)
  $: namedWorkspaceRoles = workspaceRoles.filter(
    (role): role is Role & { _id: string } => !!role._id
  )
  $: roleColorLookup = namedWorkspaceRoles.reduce<
    Record<string, string | undefined>
  >((acc, role) => {
    acc[role._id] = role.uiMetadata?.color
    return acc
  }, {})
  $: customEndUserRoleOptions = namedWorkspaceRoles
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
  $: assignedWorkspaceIds = group ? groups.getGroupAppIds(group) : []
  $: workspaceOptions = Object.values(
    $workspacesStore.apps.reduce<Record<string, WorkspaceOption>>(
      (acc, workspace) => {
        const prodWorkspaceId = workspacesStore.getProdWorkspaceID(
          workspace.devId || ""
        )
        if (!prodWorkspaceId) {
          return acc
        }
        if (
          assignedWorkspaceIds.includes(prodWorkspaceId) ||
          acc[prodWorkspaceId]
        ) {
          return acc
        }
        acc[prodWorkspaceId] = {
          label: workspace.name,
          value: prodWorkspaceId,
        }
        return acc
      },
      {}
    )
  ).sort((a, b) => a.label.localeCompare(b.label))
  $: validOptionIds = workspaceOptions.map(option => option.value)
  $: selectedWorkspaceIdsForSubmit = selectedWorkspaceIds.filter(id =>
    validOptionIds.includes(id)
  )
  $: confirmDisabled =
    !selectedWorkspaceIdsForSubmit.length ||
    (selectedRole === Constants.BudibaseRoles.AppUser && !selectedEndUserRole)
  $: singleWorkspaceId =
    selectedWorkspaceIdsForSubmit.length === 1
      ? selectedWorkspaceIdsForSubmit[0]
      : null
  $: handleWorkspaceSelectionChange(singleWorkspaceId)
  $: if (
    !endUserRoleOptions.find(option => option.value === selectedEndUserRole)
  ) {
    selectedEndUserRole = Constants.Roles.BASIC
  }

  function handleWorkspaceSelectionChange(workspaceId: string | null) {
    const requestId = ++roleRequestId
    workspaceRoles = []
    if (workspaceId) {
      fetchWorkspaceRoles(workspaceId, requestId)
    }
  }

  async function fetchWorkspaceRoles(appId: string, requestId: number) {
    try {
      const response = await API.getRolesForApp(appId)
      if (requestId === roleRequestId) {
        workspaceRoles = response?.roles || []
      }
    } catch (error) {
      if (requestId === roleRequestId) {
        workspaceRoles = []
      }
    }
  }

  export function reset() {
    selectedWorkspaceIds = []
    selectedRole = Constants.BudibaseRoles.AppUser
    selectedEndUserRole = Constants.Roles.BASIC
    workspaceSearchTerm = ""
    workspaceRoles = []
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
      getOptionLabel={(option: WorkspaceOption) => option.label}
      getOptionValue={(option: WorkspaceOption) => option.value}
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
