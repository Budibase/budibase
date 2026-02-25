<script>
  import EditUserPicker from "./EditUserPicker.svelte"
  import BulkAddUsersModal from "./BulkAddUsersModal.svelte"

  import {
    Button,
    Heading,
    Modal,
    Pagination,
    ProgressCircle,
    Table,
    Search,
  } from "@budibase/bbui"
  import { fetchData, Utils } from "@budibase/frontend-core"
  import { API } from "@/api"
  import { groups } from "@/stores/portal/groups"
  import { setContext } from "svelte"
  import { bb } from "@/stores/bb"

  import RemoveUserTableRenderer from "../_components/RemoveUserTableRenderer.svelte"
  import ActiveDirectoryInfo from "../../_components/ActiveDirectoryInfo.svelte"

  export let groupId
  export let readonly
  export let isScimGroup

  const PAGE_SIZE = 5
  let emailSearchInput
  let emailSearch
  let fetchGroupUsers
  let bulkAddModal
  const debouncedUpdateEmailSearch = Utils.debounce(value => {
    emailSearch = value || undefined
  }, 200)
  $: debouncedUpdateEmailSearch(emailSearchInput)
  $: fetchGroupUsers = fetchData({
    API,
    datasource: {
      type: "groupUser",
    },
    options: {
      limit: PAGE_SIZE,
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
  $: loadingRows = [...Array(PAGE_SIZE)].map((_, index) => ({
    _id: `loading-${index}`,
    __skeleton: true,
    __selectable: false,
  }))
  $: loadedRows = $fetchGroupUsers?.rows || []
  $: hasPagination =
    $fetchGroupUsers.hasPrevPage || $fetchGroupUsers.hasNextPage
  $: showPagination = hasPagination
  $: fillerRows =
    hasPagination && loadedRows.length < PAGE_SIZE
      ? [...Array(PAGE_SIZE - loadedRows.length)].map((_, index) => ({
          _id: `filler-${index}`,
          __skeleton: true,
          __selectable: false,
        }))
      : []
  $: tableRows = $fetchGroupUsers.loading
    ? loadingRows
    : [...loadedRows, ...fillerRows]

  const removeUser = async id => {
    await groups.removeUser(groupId, id)
    fetchGroupUsers.refresh()
  }

  setContext("users", {
    removeUser,
  })
</script>

<div class="header">
  {#if isScimGroup}
    <ActiveDirectoryInfo text="Users synced from your AD" />
  {:else if !readonly}
    <div class="controls-left">
      <EditUserPicker
        {groupId}
        onUsersUpdated={fetchGroupUsers.getInitialData}
      />
      <Button secondary on:click={() => bulkAddModal.show()}>
        Bulk assign
      </Button>
    </div>
  {/if}

  <div class="controls-right">
    <div class="search-with-loading">
      <div class="search-loading">
        {#if $fetchGroupUsers.loading}
          <ProgressCircle size="S" />
        {/if}
      </div>
      <Search bind:value={emailSearchInput} placeholder="Search email" />
    </div>
  </div>
</div>
<Table
  schema={userSchema}
  data={tableRows}
  loading={false}
  rowCount={PAGE_SIZE}
  allowEditRows={false}
  allowEditColumns={false}
  customPlaceholder
  customRenderers={customUserTableRenderers}
  on:click={e => {
    if (e.detail?.__skeleton) {
      return
    }
    bb.settings(`/people/users/${e.detail._id}`)
  }}
>
  <div class="placeholder" slot="placeholder">
    <Heading size="S"
      >{emailSearchInput
        ? `No users found matching the email "${emailSearchInput}"`
        : "This user group doesn't have any users"}
    </Heading>
  </div>
</Table>

{#if showPagination}
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
{/if}

<Modal bind:this={bulkAddModal}>
  <BulkAddUsersModal {groupId} onUsersAdded={fetchGroupUsers.getInitialData} />
</Modal>

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
  .controls-left {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: var(--spacing-m);
  }

  .controls-right {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    gap: var(--spacing-xl);
  }
  .search-with-loading {
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
  }
  .search-loading {
    width: 16px;
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .controls-right :global(.spectrum-Search) {
    width: 200px;
  }
</style>
