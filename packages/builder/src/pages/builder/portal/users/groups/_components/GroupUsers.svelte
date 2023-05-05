<script>
  import {
    Button,
    Heading,
    Pagination,
    Popover,
    Table,
    notifications,
  } from "@budibase/bbui"
  import { fetchData } from "@budibase/frontend-core"
  import { goto } from "@roxi/routify"
  import { API } from "api"
  import UserGroupPicker from "components/settings/UserGroupPicker.svelte"
  import { createPaginationStore } from "helpers/pagination"
  import { auth, features, groups, users } from "stores/portal"
  import { setContext } from "svelte"
  import ScimBanner from "../../_components/SCIMBanner.svelte"
  import RemoveUserTableRenderer from "../_components/RemoveUserTableRenderer.svelte"

  export let groupId

  const fetchGroupUsers = fetchData({
    API,
    datasource: {
      type: "groupUser",
    },
    options: {
      query: {
        groupId,
      },
    },
  })

  $: userSchema = {
    email: {
      width: "1fr",
    },
    ...(readonly
      ? {}
      : {
          _id: {
            displayName: "",
            width: "auto",
            borderLeft: true,
          },
        }),
  }
  const customUserTableRenderers = [
    {
      column: "_id",
      component: RemoveUserTableRenderer,
    },
  ]

  let popoverAnchor
  let popover
  let searchTerm = ""
  let prevSearch = undefined
  let searchUsersPageInfo = createPaginationStore()

  $: scimEnabled = $features.isScimEnabled
  $: readonly = !$auth.isAdmin || scimEnabled
  $: page = $searchUsersPageInfo.page
  $: searchUsers(page, searchTerm)
  $: group = $groups.find(x => x._id === groupId)

  async function searchUsers(page, search) {
    if ($searchUsersPageInfo.loading) {
      return
    }
    // need to remove the page if they've started searching
    if (search && !prevSearch) {
      searchUsersPageInfo.reset()
      page = undefined
    }
    prevSearch = search
    try {
      searchUsersPageInfo.loading()
      await users.search({ page, email: search })
      searchUsersPageInfo.fetched($users.hasNextPage, $users.nextPage)
    } catch (error) {
      notifications.error("Error getting user list")
    }
  }

  const removeUser = async id => {
    await groups.actions.removeUser(groupId, id)
    fetchGroupUsers.refresh()
  }

  setContext("users", {
    removeUser,
  })
</script>

<div class="header">
  <Heading size="S">Users</Heading>
  {#if !scimEnabled}
    <div bind:this={popoverAnchor}>
      <Button disabled={readonly} on:click={popover.show()} cta>Add user</Button
      >
    </div>
  {:else}
    <ScimBanner />
  {/if}
  <Popover align="right" bind:this={popover} anchor={popoverAnchor}>
    <UserGroupPicker
      bind:searchTerm
      labelKey="email"
      selected={group.users?.map(user => user._id)}
      list={$users.data}
      on:select={async e => {
        await groups.actions.addUser(groupId, e.detail)
        fetchGroupUsers.getInitialData()
      }}
      on:deselect={async e => {
        await groups.actions.removeUser(groupId, e.detail)
        fetchGroupUsers.getInitialData()
      }}
    />
  </Popover>
</div>

<Table
  schema={userSchema}
  data={$fetchGroupUsers?.rows}
  allowEditRows={false}
  customPlaceholder
  customRenderers={customUserTableRenderers}
  on:click={e => $goto(`../users/${e.detail._id}`)}
>
  <div class="placeholder" slot="placeholder">
    <Heading size="S">This user group doesn't have any users</Heading>
  </div>
</Table>

<div class="pagination">
  <Pagination
    page={$fetchGroupUsers.pageNumber + 1}
    hasPrevPage={$fetchGroupUsers.loading
      ? false
      : $fetchGroupUsers.hasPrevPage}
    hasNextPage={$fetchGroupUsers.loading
      ? false
      : $fetchGroupUsers.hasNextPage}
    goToPrevPage={$fetchGroupUsers.loading ? null : fetchGroupUsers.prevPage}
    goToNextPage={$fetchGroupUsers.loading ? null : fetchGroupUsers.nextPage}
  />
</div>

<style>
  .header {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: var(--spacing-l);
  }
  .header :global(.spectrum-Heading) {
    flex: 1 1 auto;
  }
  .placeholder {
    width: 100%;
    text-align: center;
  }
</style>
