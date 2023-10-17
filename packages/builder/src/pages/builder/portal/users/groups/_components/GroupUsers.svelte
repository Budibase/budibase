<script>
  import EditUserPicker from "./EditUserPicker.svelte"

  import { Heading, Pagination, Table, Search } from "@budibase/bbui"
  import { fetchData } from "@budibase/frontend-core"
  import { goto } from "@roxi/routify"
  import { API } from "api"
  import { auth, features, groups } from "stores/portal"
  import { setContext } from "svelte"
  import ScimBanner from "../../_components/SCIMBanner.svelte"
  import RemoveUserTableRenderer from "../_components/RemoveUserTableRenderer.svelte"
  import { sdk } from "@budibase/shared-core"

  export let groupId

  let emailSearch
  let fetchGroupUsers
  $: fetchGroupUsers = fetchData({
    API,
    datasource: {
      type: "groupUser",
    },
    options: {
      query: {
        groupId,
        emailSearch,
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

  $: scimEnabled = $features.isScimEnabled
  $: readonly = !sdk.users.isAdmin($auth.user) || scimEnabled

  const removeUser = async id => {
    await groups.actions.removeUser(groupId, id)
    fetchGroupUsers.refresh()
  }

  setContext("users", {
    removeUser,
  })
</script>

<div class="header">
  {#if !scimEnabled}
    <EditUserPicker {groupId} onUsersUpdated={fetchGroupUsers.getInitialData} />
  {:else}
    <ScimBanner />
  {/if}

  <div class="controls-right">
    <Search bind:value={emailSearch} placeholder="Search email" />
  </div>
</div>
<Table
  schema={userSchema}
  data={$fetchGroupUsers?.rows}
  loading={$fetchGroupUsers.loading}
  allowEditRows={false}
  customPlaceholder
  customRenderers={customUserTableRenderers}
  on:click={e => $goto(`../users/${e.detail._id}`)}
>
  <div class="placeholder" slot="placeholder">
    <Heading size="S"
      >{emailSearch
        ? `No users found matching the email "${emailSearch}"`
        : "This user group doesn't have any users"}</Heading
    >
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
    justify-content: space-between;
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

  .controls-right {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    gap: var(--spacing-xl);
  }
  .controls-right :global(.spectrum-Search) {
    width: 200px;
  }
</style>
