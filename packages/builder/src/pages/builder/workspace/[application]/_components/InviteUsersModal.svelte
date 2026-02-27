<script lang="ts">
  import { keepOpen, Modal, notifications } from "@budibase/bbui"
  import { Constants } from "@budibase/frontend-core"
  import type { BulkUserCreated } from "@budibase/types"
  import { createEventDispatcher, onMount } from "svelte"
  import { OnboardingType } from "@/constants"
  import AddUserModal from "@/settings/pages/people/users/_components/AddUserModal.svelte"
  import {
    assignExistingUsersToWorkspace,
    getWorkspaceRole,
    type UserData,
  } from "@/settings/pages/people/users/workspaceInviteUtils"
  import { appStore, roles } from "@/stores/builder"
  import { users } from "@/stores/portal"
  import type { UserInfo } from "@/types"
  import { sdk } from "@budibase/shared-core"

  let createUserModal: Modal
  const dispatch = createEventDispatcher()
  let hasOpened = false

  $: currentWorkspaceId = $appStore.appId
    ? sdk.applications.getProdAppID($appStore.appId)
    : ""

  const removingDuplicities = async (userData: UserData): Promise<UserData> => {
    const newUsers: UserInfo[] = []
    const seenEmails = new Set<string>()

    for (const user of userData?.users ?? []) {
      const email = user.email.toLowerCase()
      if (seenEmails.has(email)) {
        continue
      }
      seenEmails.add(email)
      newUsers.push(user)
    }

    return { ...userData, users: newUsers }
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
    const payload = usersForInvite.map(user => {
      const workspaceRole = getWorkspaceRole(
        currentWorkspaceId,
        user.role,
        user.appRole
      )
      return {
        email: user.email,
        builder: user.role === Constants.BudibaseRoles.Developer,
        creator: user.role === Constants.BudibaseRoles.Creator,
        admin: user.role === Constants.BudibaseRoles.Admin,
        groups: userData.groups,
        apps:
          assignToWorkspace && currentWorkspaceId && workspaceRole
            ? { [currentWorkspaceId]: workspaceRole }
            : undefined,
      }
    })

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

    await Promise.all(
      response.successful.map(async user => {
        const matchingUser = usersForCreation.users.find(
          created => created.email === user.email
        )
        const role = getWorkspaceRole(
          currentWorkspaceId,
          matchingUser?.role,
          matchingUser?.appRole
        )
        if (!role) {
          return
        }
        const fullUser = await users.get(user._id)
        if (fullUser?._rev) {
          await users.addUserToWorkspace(user._id, role, fullUser._rev)
        }
      })
    )

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
