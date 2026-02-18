<script lang="ts">
  import { Button, Popover, notifications } from "@budibase/bbui"
  import { Constants } from "@budibase/frontend-core"
  import { API } from "@/api"
  import { createPaginationStore } from "@/helpers/pagination"
  import { users } from "@/stores/portal/users"
  import UserGroupPicker from "@/components/settings/UserGroupPicker.svelte"
  import type { StrippedUser, User } from "@budibase/types"

  export let workspaceId: string
  export let onUsersUpdated: () => Promise<void>

  let popoverAnchor: HTMLDivElement
  let popover: InstanceType<typeof Popover>
  let searchTerm = ""
  let prevSearch: string | undefined = undefined
  let pageInfo = createPaginationStore()
  let availableUsers: (User | StrippedUser)[] = []

  $: page = $pageInfo.page
  $: searchUsers(page, searchTerm)

  const getWorkspaceUserIds = async (userIds: string[]) => {
    if (!workspaceId || !userIds.length) {
      return new Set<string>()
    }

    const workspaceUsers = await API.searchUsers({
      workspaceId,
      limit: userIds.length,
      query: { oneOf: { _id: userIds } },
    })
    return new Set(
      (workspaceUsers?.data || [])
        .map(user => user?._id)
        .filter((userId): userId is string => !!userId)
    )
  }

  const searchUsers = async (
    page: string | null | undefined,
    search: string
  ) => {
    if ($pageInfo.loading) {
      return
    }

    if (search && !prevSearch) {
      pageInfo.reset()
      page = undefined
    }

    prevSearch = search

    try {
      pageInfo.loading()
      const results = await users.search({
        bookmark: page ?? undefined,
        query: { string: { email: search } },
      })
      const resultData = results?.data || []
      const resultIds = resultData
        .map(user => user?._id)
        .filter((userId): userId is string => !!userId)
      const workspaceUserIds = await getWorkspaceUserIds(resultIds)

      availableUsers = resultData.filter(
        user => !user._id || !workspaceUserIds.has(user._id)
      )
      pageInfo.fetched(!!results?.hasNextPage, results?.nextPage || "")
    } catch (error) {
      notifications.error("Error getting user list")
    }
  }

  const addUserToWorkspace = async (userId: string) => {
    try {
      const user = await users.get(userId)
      if (!user?._rev) {
        notifications.error("Error adding user to workspace")
        return
      }

      await users.addUserToWorkspace(userId, Constants.Roles.BASIC, user._rev)
      await searchUsers($pageInfo.page, searchTerm)
      await onUsersUpdated()
    } catch (error) {
      notifications.error("Error adding user to workspace")
    }
  }
</script>

<div bind:this={popoverAnchor}>
  <Button on:click={() => popover?.show()} cta>Add user</Button>
</div>

<Popover align="left" bind:this={popover} anchor={popoverAnchor}>
  <UserGroupPicker
    bind:searchTerm
    labelKey="email"
    selected={[]}
    list={availableUsers}
    on:select={async e => {
      await addUserToWorkspace(e.detail)
    }}
  />
</Popover>
