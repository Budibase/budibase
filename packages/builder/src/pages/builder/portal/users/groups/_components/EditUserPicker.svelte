<script>
  import { Button, Popover, notifications } from "@budibase/bbui"
  import UserGroupPicker from "components/settings/UserGroupPicker.svelte"
  import { createPaginationStore } from "helpers/pagination"
  import { auth, groups, users } from "stores/portal"
  import { sdk } from "@budibase/shared-core"

  export let groupId
  export let onUsersUpdated

  let popoverAnchor
  let popover
  let searchTerm = ""
  let prevSearch = undefined
  let pageInfo = createPaginationStore()

  $: readonly = !sdk.users.isAdmin($auth.user)
  $: page = $pageInfo.page
  $: searchUsers(page, searchTerm)
  $: group = $groups.find(x => x._id === groupId)

  async function searchUsers(page, search) {
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
        bookmark: page,
        query: { string: { email: search } },
      })
      pageInfo.fetched($users.hasNextPage, $users.nextPage)
    } catch (error) {
      notifications.error("Error getting user list")
    }
  }
</script>

<div bind:this={popoverAnchor}>
  <Button disabled={readonly} on:click={popover.show()} cta>Add user</Button>
</div>
<Popover align="right" bind:this={popover} anchor={popoverAnchor}>
  <UserGroupPicker
    bind:searchTerm
    labelKey="email"
    selected={group.users?.map(user => user._id)}
    list={$users.data}
    on:select={async e => {
      await groups.actions.addUser(groupId, e.detail)
      onUsersUpdated()
    }}
    on:deselect={async e => {
      await groups.actions.removeUser(groupId, e.detail)
      onUsersUpdated()
    }}
  />
</Popover>
