<script lang="ts">
  import { keepOpen, Modal, notifications } from "@budibase/bbui"
  import type { BulkUserCreated, InviteUsersResponse } from "@budibase/types"
  import { onMount } from "svelte"
  import { OnboardingType } from "@/constants"
  import AddUserModal from "@/settings/pages/people/users/_components/AddUserModal.svelte"
  import InvitedModal from "@/settings/pages/people/users/_components/InvitedModal.svelte"
  import PasswordModal from "@/settings/pages/people/users/_components/PasswordModal.svelte"
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
  let passwordConfirmationModal: Modal
  let isOpened = false
  let showingInviteConfirmation = false
  let showingPasswordConfirmation = false
  let inviteUsersResponse: InviteUsersResponse = {
    successful: [],
    unsuccessful: [],
  }
  let createUsersResponse: BulkUserCreated = {
    successful: [],
    unsuccessful: [],
  }
  let addedToWorkspaceEmails: string[] = []
  let createdUsers: UserData["users"] = []

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
    createdUsers = usersForCreation.users
    addedToWorkspaceEmails = result.addedToWorkspaceEmails

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
    createUsersResponse = (await users.create(usersForCreation)) || {
      successful: [],
      unsuccessful: [],
    }

    if (
      assignToWorkspace &&
      currentWorkspaceId &&
      createUsersResponse.successful?.length
    ) {
      const assignmentResult = await assignCreatedUsersToWorkspace(
        createUsersResponse.successful,
        usersForCreation.users,
        currentWorkspaceId
      )
      if (assignmentResult.failedCount) {
        notifications.error("Error adding some users to workspace")
      }
    }

    notifications.success("Successfully created user")
    showingPasswordConfirmation = true
    passwordConfirmationModal.show()
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
    if (showingInviteConfirmation || showingPasswordConfirmation) {
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

  const hidePasswordConfirmationModal = () => {
    showingPasswordConfirmation = false
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

<Modal
  bind:this={passwordConfirmationModal}
  disableCancel={true}
  on:hide={hidePasswordConfirmationModal}
>
  <PasswordModal
    {createUsersResponse}
    userData={createdUsers}
    {addedToWorkspaceEmails}
  />
</Modal>
