<script lang="ts">
  import { keepOpen, Modal, notifications } from "@budibase/bbui"
  import { Constants } from "@budibase/frontend-core"
  import { sdk } from "@budibase/shared-core"
  import type { BulkUserCreated } from "@budibase/types"
  import { createEventDispatcher, onMount } from "svelte"
  import { OnboardingType } from "@/constants"
  import AddUserModal from "@/settings/pages/people/users/_components/AddUserModal.svelte"
  import { appStore, roles } from "@/stores/builder"
  import { users } from "@/stores/portal"
  import type { UserInfo } from "@/types"

  interface UserData {
    users: UserInfo[]
    groups: string[]
    assignToWorkspace?: boolean
  }

  let createUserModal: Modal
  const dispatch = createEventDispatcher()
  let hasOpened = false

  $: currentWorkspaceId = $appStore.appId
    ? sdk.applications.getProdAppID($appStore.appId)
    : ""

  const getWorkspaceRole = (role?: string, appRole?: string) => {
    if (!currentWorkspaceId || !role) {
      return undefined
    }
    if (role === Constants.BudibaseRoles.Creator) {
      return Constants.Roles.ADMIN
    }
    if (role === Constants.BudibaseRoles.Admin) {
      return Constants.Roles.ADMIN
    }
    if (role === Constants.BudibaseRoles.AppUser) {
      return appRole || Constants.Roles.BASIC
    }
    return Constants.Roles.BASIC
  }

  const removingDuplicities = async (userData: UserData): Promise<UserData> => {
    const currentUserEmails = (await users.fetch())?.map(x => x.email) || []
    const newUsers: UserInfo[] = []

    for (const user of userData?.users ?? []) {
      const { email } = user
      if (
        newUsers.find(x => x.email === email) ||
        currentUserEmails.includes(email)
      ) {
        continue
      }
      newUsers.push(user)
    }

    if (!newUsers.length) {
      notifications.info("No new users to add.")
    }
    return { ...userData, users: newUsers }
  }

  const inviteUsers = async (userData: UserData) => {
    const assignToWorkspace = userData.assignToWorkspace ?? true
    const payload = (userData.users ?? []).map(user => {
      const workspaceRole = getWorkspaceRole(user.role, user.appRole)
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
    const assignToWorkspace = userData.assignToWorkspace ?? true
    let response: BulkUserCreated = { successful: [], unsuccessful: [] }
    response = (await users.create(userData)) || response

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
        const matchingUser = userData.users.find(
          created => created.email === user.email
        )
        const role = getWorkspaceRole(matchingUser?.role, matchingUser?.appRole)
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
