<script lang="ts">
  import { Button, Popover, notifications } from "@budibase/bbui"
  import UserGroupPicker from "@/components/settings/UserGroupPicker.svelte"
  import { createPaginationStore } from "@/helpers/pagination"
  import { groups } from "@/stores/portal/groups"
  import { users } from "@/stores/portal/users"
  import { untrack } from "svelte"

  interface Props {
    groupId: string
    onUsersUpdated: () => void | Promise<void>
  }

  let { groupId, onUsersUpdated }: Props = $props()

  let popoverAnchor = $state<HTMLDivElement>()
  let popover = $state<Popover>()
  let searchTerm = $state("")
  let prevSearch = $state<string | undefined>()
  const pageInfo = createPaginationStore()

  const group = $derived($groups.find(x => x._id === groupId))

  const searchUsers = async ({
    page,
    search,
  }: {
    page?: string | null
    search: string
  }) => {
    if ($pageInfo.loading) {
      return
    }
    // need to remove the page if they've started searching
    if (search && !prevSearch) {
      pageInfo.reset()
      page = undefined
    }
    prevSearch = search
    try {
      pageInfo.loading()
      await users.search({
        bookmark: page || undefined,
        query: { string: { email: search } },
      })
      pageInfo.fetched(!!$users.hasNextPage, $users.nextPage || "")
    } catch (error) {
      notifications.error("Error getting user list")
    }
  }

  $effect(() => {
    const page = $pageInfo.page
    const search = searchTerm || ""
    untrack(() => searchUsers({ page, search }))
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
    list={$users.data}
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
