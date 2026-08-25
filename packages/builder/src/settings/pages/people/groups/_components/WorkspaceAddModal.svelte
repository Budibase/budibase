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
  import { roles } from "@/stores/builder"
  import { workspacesStore } from "@/stores/portal/workspaces"
  import { groups } from "@/stores/portal/groups"
  import { Constants } from "@budibase/frontend-core"
  import GroupIcon from "./GroupIcon.svelte"

  interface WorkspaceOption {
    label: string
    value: string
  }

  interface Props {
    groupId: string
  }

  let { groupId }: Props = $props()

  const workspaceRoleOptions = Constants.BudibaseRoleOptions.filter(
    option =>
      option.value === Constants.BudibaseRoles.Creator ||
      option.value === Constants.BudibaseRoles.AppUser
  )

  let selectedWorkspaceIds = $state<string[]>([])
  let selectedRole = $state(Constants.BudibaseRoles.AppUser)
  let selectedEndUserRole = $state(Constants.Roles.BASIC)
  let workspaceSearchTerm = $state("")

  const group = $derived($groups.find(x => x._id === groupId))
  const roleColorLookup = $derived(
    ($roles || []).reduce<Record<string, string | undefined>>((acc, role) => {
      acc[role._id] = role.uiMetadata?.color
      return acc
    }, {})
  )
  const endUserRoleOptions = $derived([
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
  ])
  const assignedWorkspaceIds = $derived(
    group ? groups.getGroupAppIds(group) : []
  )
  const workspaceOptions = $derived(
    Object.values(
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
  )
  const validOptionIds = $derived(workspaceOptions.map(option => option.value))
  const selectedWorkspaceIdsForSubmit = $derived(
    selectedWorkspaceIds.filter(id => validOptionIds.includes(id))
  )
  const confirmDisabled = $derived(
    !selectedWorkspaceIdsForSubmit.length ||
      (selectedRole === Constants.BudibaseRoles.AppUser && !selectedEndUserRole)
  )

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
