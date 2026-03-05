<script lang="ts">
  import { keepOpen, Modal, notifications } from "@budibase/bbui"
  import type { BulkUserCreated, InviteUsersResponse } from "@budibase/types"
  import { onMount } from "svelte"
  import { OnboardingType } from "@/constants"
  import AddUserModal from "@/settings/pages/people/users/_components/AddUserModal.svelte"
  import InvitedModal from "@/settings/pages/people/users/_components/InvitedModal.svelte"
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

  export let onHide: () => void = () => {}

  let createUserModal: Modal
  let inviteConfirmationModal: Modal
  let isOpened = false
  let showingInviteConfirmation = false
  let inviteUsersResponse: InviteUsersResponse = {
    successful: [],
    unsuccessful: [],
  }

  $: currentWorkspaceId = $appStore.appId
    ? sdk.applications.getProdAppID($appStore.appId)
    : ""

  const removeDuplicates = (userData: UserData): UserData => {
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
      if (!result.assignedCount && !result.failedCount) {
        notifications.info("No users available to invite")
      }
      return
    }

    const assignToWorkspace = userData.assignToWorkspace ?? true
    const payload = buildWorkspaceInvitePayload(
      usersForInvite,
      userData.groups,
      currentWorkspaceId,
      assignToWorkspace
    )

    inviteUsersResponse = await users.invite(payload)
    showingInviteConfirmation = true
    inviteConfirmationModal.show()
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
      if (!result.assignedCount && !result.failedCount) {
        notifications.info("No users available to create")
      }
      return
    }

    const assignToWorkspace = userData.assignToWorkspace ?? true
    let response: BulkUserCreated = { successful: [], unsuccessful: [] }
    response = (await users.create(usersForCreation)) || response

    if (!response.successful?.length) {
      throw new Error("No users were created")
    }

    if (!assignToWorkspace || !currentWorkspaceId) {
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
    const userData = removeDuplicates(addUsersData)
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
      notifications.error("Error processing users")
      return keepOpen
    }
  }

  const hideModal = () => {
    if (!isOpened) {
      return
    }
    isOpened = false
    if (showingInviteConfirmation) {
      return
    }
    onHide()
  }

  const showModal = () => {
    isOpened = true
  }

  const hideInviteConfirmationModal = () => {
    showingInviteConfirmation = false
    onHide()
  }

  onMount(() => {
    roles.fetch()
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

<Modal
  bind:this={inviteConfirmationModal}
  on:hide={hideInviteConfirmationModal}
>
  <InvitedModal {inviteUsersResponse} />
</Modal>
