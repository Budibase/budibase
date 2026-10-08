<script lang="ts">
  import { Button, Popover, notifications } from "@budibase/bbui"
  import UserGroupPicker from "@/components/settings/UserGroupPicker.svelte"
  import { API } from "@/api"
  import { groups } from "@/stores/portal/groups"
  import type { StrippedUser, User } from "@budibase/types"
  import { untrack } from "svelte"

  interface Props {
    groupId: string
    onUsersUpdated: () => void | Promise<void>
  }

  let { groupId, onUsersUpdated }: Props = $props()

  let popoverAnchor = $state<HTMLDivElement>()
  let popover = $state<Popover>()
  let searchTerm = $state("")
  let userList = $state<(User | StrippedUser)[]>([])
  let nextPage = $state<string | undefined>()
  let hasNextPage = $state(false)
  let loading = $state(false)
  // used to discard responses from outdated searches
  let searchId = 0

  const group = $derived($groups.find(x => x._id === groupId))

  const fetchUsers = async ({
    search,
    bookmark,
  }: {
    search: string
    bookmark?: string
  }) => {
    const id = bookmark ? searchId : ++searchId
    loading = true
    try {
      const response = await API.searchUsers({
        bookmark,
        query: { string: { email: search } },
      })
      if (id !== searchId) {
        return
      }
      userList = bookmark ? [...userList, ...response.data] : response.data
      hasNextPage = !!response.hasNextPage
      nextPage = response.nextPage || undefined
    } catch (error) {
      if (id === searchId) {
        notifications.error("Error getting user list")
      }
    } finally {
      if (id === searchId) {
        loading = false
      }
    }
  }

  const loadMore = () => {
    if (loading || !hasNextPage || !nextPage) {
      return
    }
    fetchUsers({ search: searchTerm, bookmark: nextPage })
  }

  $effect(() => {
    const search = searchTerm
    untrack(() => fetchUsers({ search }))
  })
</script>

<div bind:this={popoverAnchor}>
  <Button on:click={() => popover?.show()} cta>Assign user</Button>
</div>
<Popover align="left" bind:this={popover} anchor={popoverAnchor}>
  <UserGroupPicker
    bind:searchTerm
    labelKey="email"
    selected={group?.users?.map(user => user._id)}
    list={userList}
    hasMore={hasNextPage}
    {loading}
    onLoadMore={loadMore}
    on:select={async e => {
      await groups.addUser(groupId, e.detail)
      onUsersUpdated()
    }}
    on:deselect={async e => {
      await groups.removeUser(groupId, e.detail)
      onUsersUpdated()
    }}
  />
</Popover>
