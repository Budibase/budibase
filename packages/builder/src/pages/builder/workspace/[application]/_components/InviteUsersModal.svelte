<script lang="ts">
  import { keepOpen, Modal, notifications } from "@budibase/bbui"
  import type { BulkUserCreated } from "@budibase/types"
  import { createEventDispatcher, onMount } from "svelte"
  import { OnboardingType } from "@/constants"
  import AddUserModal from "@/settings/pages/people/users/_components/AddUserModal.svelte"
  import {
    assignCreatedUsersToWorkspace,
    assignExistingUsersToWorkspace,
    buildWorkspaceInvitePayload,
    dedupeUsersByEmail,
    type UserData,
  } from "@/settings/pages/people/users/workspaceInviteUtils"
  import { appStore, roles } from "@/stores/builder"
  import { users } from "@/stores/portal"
  import { sdk } from "@budibase/shared-core"

  let createUserModal: Modal
  const dispatch = createEventDispatcher()
  let hasOpened = false

  $: currentWorkspaceId = $appStore.appId
    ? sdk.applications.getProdAppID($appStore.appId)
    : ""

  const removingDuplicities = async (userData: UserData): Promise<UserData> => {
    return dedupeUsersByEmail(userData)
  }

  const inviteUsers = async (userData: UserData) => {
    const result = await assignExistingUsersToWorkspace(
      userData,
      currentWorkspaceId
    )
    const usersForInvite = result.usersToInvite

    if (result.assignedCount && !usersForInvite.length) {
      notifications.success("Users added to workspace")
    }
    if (result.failedCount) {
      notifications.error("Error adding some users to workspace")
    }
    if (!usersForInvite.length) {
      return
    }

    const assignToWorkspace = userData.assignToWorkspace ?? true
    const payload = buildWorkspaceInvitePayload(
      usersForInvite,
      userData.groups,
      currentWorkspaceId,
      assignToWorkspace
    )

    await users.invite(payload)
    notifications.success("User invite successful")
  }

  const createUsers = async (userData: UserData) => {
    const result = await assignExistingUsersToWorkspace(
      userData,
      currentWorkspaceId
    )
    const usersForCreation = { ...userData, users: result.usersToInvite }

    if (result.assignedCount && !usersForCreation.users.length) {
      notifications.success("Users added to workspace")
    }
    if (result.failedCount) {
      notifications.error("Error adding some users to workspace")
    }
    if (!usersForCreation.users.length) {
      return
    }

    const assignToWorkspace = userData.assignToWorkspace ?? true
    let response: BulkUserCreated = { successful: [], unsuccessful: [] }
    response = (await users.create(usersForCreation)) || response

    if (
      !assignToWorkspace ||
      !currentWorkspaceId ||
      !response.successful?.length
    ) {
      notifications.success("Successfully created user")
      return
    }

    const assignmentResult = await assignCreatedUsersToWorkspace(
      response.successful,
      usersForCreation.users,
      currentWorkspaceId
    )
    if (assignmentResult.failedCount) {
      notifications.error("Error adding some users to workspace")
    }

    notifications.success("Successfully created user")
  }

  const showOnboardingTypeModal = async (
    addUsersData: UserData,
    onboardingType?: string
  ) => {
    const userData = await removingDuplicities(addUsersData)
    if (!userData?.users?.length) {
      return keepOpen
    }

    try {
      if (onboardingType === OnboardingType.PASSWORD) {
        await createUsers(userData)
      } else {
        await inviteUsers(userData)
      }
    } catch (error) {
      console.error(error)
      notifications.error("Error inviting user")
      return keepOpen
    }
  }

  const hideModal = () => {
    if (!hasOpened) {
      return
    }
    dispatch("hide")
  }

  const showModal = () => {
    hasOpened = true
  }

  onMount(() => {
    roles.fetch().catch(() => {})
    createUserModal.show()
  })
</script>

<Modal
  bind:this={createUserModal}
  closeOnOutsideClick={false}
  on:show={showModal}
  on:hide={hideModal}
>
  <AddUserModal
    {showOnboardingTypeModal}
    workspaceOnly={true}
    useWorkspaceInviteModal={true}
    assignToWorkspace={true}
    inviteTitle="Invite users to workspace"
  />
</Modal>
