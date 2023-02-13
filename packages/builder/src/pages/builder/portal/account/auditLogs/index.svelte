<script>
  import {
    Layout,
    Table,
    Select,
    Search,
    Multiselect,
    notifications,
  } from "@budibase/bbui"
  import { licensing, users, apps } from "stores/portal"
  import LockedFeature from "../../_components/LockedFeature.svelte"
  import { createPaginationStore } from "helpers/pagination"
  import { getContext, setContext } from "svelte"
  import Portal from "svelte-portal"
  import ViewDetailsRenderer from "./_components/ViewDetailsRenderer.svelte"
  import UserRenderer from "./_components/UserRenderer.svelte"

  const sidePanel = getContext("side-panel")
  const schema = {
    name: {},
    date: {},
    user: { width: "auto" },
    app: {},
    event: {},
    view: { width: "auto", borderLeft: true, displayName: "" },
  }

  const customRenderers = [
    {
      column: "view",
      component: ViewDetailsRenderer,
    },
    {
      column: "user",
      component: UserRenderer,
    },
  ]

  let searchTerm = ""
  let pageInfo = createPaginationStore()
  let prevSearch = undefined
  let selectedUsers = []
  let selectedLog

  let data = [
    {
      name: "User created",
      date: "2021-03-01 12:00:00",
      user: "Peter Clement",
      app: "School Admin Panel",
      event: "User added",
      metadata: {
        name: "Peter Clement",
        email: "",
      },
    },
  ]

  $: fetchUsers(page, searchTerm)
  $: page = $pageInfo.page
  $: enrichedList = enrich($users.data || [], selectedUsers)
  $: sortedList = sort(enrichedList)

  const fetchUsers = async (page, search) => {
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
      await users.search({ page, email: search })
      pageInfo.fetched($users.hasNextPage, $users.nextPage)
    } catch (error) {
      notifications.error("Error getting user list")
    }
  }

  const enrich = (list, selected) => {
    return list.map(item => {
      return {
        ...item,
        selected: selected.find(x => x === item._id) != null,
      }
    })
  }

  const sort = list => {
    let sortedList = list.slice()
    sortedList?.sort((a, b) => {
      if (a.selected === b.selected) {
        return a["email"] < b["email"] ? -1 : 1
      } else if (a.selected) {
        return -1
      } else if (b.selected) {
        return 1
      }
      return 0
    })
    return sortedList
  }

  const viewDetails = detail => {
    selectedLog = detail
    sidePanel.open()
  }

  setContext("auditLogs", {
    viewDetails,
  })
</script>

<LockedFeature
  title={"Audit Logs"}
  planType={"Business plan"}
  description={"View all events that have occurred in your Budibase installation"}
  enabled={$licensing.auditLogsEnabled}
  upgradeButtonClick={async () => {
    $licensing.goToUpgradePage()
  }}
>
  <div class="controls">
    <div class="search">
      <div class="select">
        <Select placeholder="All" label="Activity" />
      </div>
      <div class="select">
        <Multiselect
          bind:fetchTerm={searchTerm}
          placeholder="All users"
          label="Users"
          autocomplete
          bind:value={selectedUsers}
          getOptionValue={user => user._id}
          getOptionLabel={user => user.email}
          options={sortedList}
        />
      </div>
      <div class="select">
        <Multiselect
          placeholder="All apps"
          label="App"
          getOptionValue={app => app.appId}
          getOptionLabel={app => app.name}
          options={$apps}
        />
      </div>
      <div class="select">
        <Multiselect placeholder="All events" label="Event" />
      </div>
    </div>
    <div style="width: 200px;">
      <Search placeholder="Search" value={""} />
    </div>
  </div>
  <Layout noPadding>
    <Table
      {customRenderers}
      on:click={viewDetails}
      {data}
      allowEditColumns={false}
      allowEditRows={false}
      allowSelectRows={false}
      {schema}
    />
  </Layout>
</LockedFeature>

{#if selectedLog}
  <Portal target="#side-panel">
    <div>hello</div>
  </Portal>
{/if}

<style>
  .controls {
    display: flex;
    flex-direction: row;
    gap: var(--spacing-l);
    align-items: flex-end;
    flex-wrap: wrap;
  }

  .search {
    display: flex;
    gap: var(--spacing-m);
    align-items: flex-start;
    flex: 1 1 auto;
    max-width: 100%;
  }
  .select {
    flex: 1 1 0;
    max-width: 200px;
    min-width: 80px;
  }
</style>
