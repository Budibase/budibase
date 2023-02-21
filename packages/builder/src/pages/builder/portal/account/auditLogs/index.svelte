<script>
  import {
    Layout,
    Table,
    Search,
    Multiselect,
    notifications,
    Icon,
    clickOutside,
    CoreTextArea,
    DatePicker,
  } from "@budibase/bbui"
  import { licensing, users, apps, auditLogs } from "stores/portal"
  import LockedFeature from "../../_components/LockedFeature.svelte"
  import { createPaginationStore } from "helpers/pagination"
  import { onMount, setContext } from "svelte"
  import ViewDetailsRenderer from "./_components/ViewDetailsRenderer.svelte"
  import UserRenderer from "./_components/UserRenderer.svelte"
  import TimeRenderer from "./_components/TimeRenderer.svelte"
  import AppColumnRenderer from "./_components/AppColumnRenderer.svelte"

  const schema = {
    date: { width: "0.8fr" },
    user: { width: "0.5fr" },
    app: { width: "1fr", fieldName: "name" },
    name: { width: "1fr" },
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
    {
      column: "date",
      component: TimeRenderer,
    },
    {
      column: "app",
      component: AppColumnRenderer,
    },
  ]

  let userSearchTerm = ""
  let logSearchTerm = ""
  let userPageInfo = createPaginationStore()
  let logsPageInfo = createPaginationStore()

  let prevUserSearch = undefined
  let prevLogSearch = undefined
  let selectedUsers = []
  let selectedApps = []
  let selectedEvents = []
  let selectedLog
  let sidePanelVisible = false
  let wideSidePanel = false
  let startDate, endDate

  $: fetchUsers(userPage, userSearchTerm)
  $: fetchLogs(
    logsPage,
    logSearchTerm,
    startDate,
    endDate,
    selectedUsers,
    selectedApps,
    selectedEvents
  )

  $: userPage = $userPageInfo.page
  $: logsPage = $logsPageInfo.page

  $: enrichedList = enrich($users.data || [], selectedUsers)
  $: sortedList = sort(enrichedList)

  const fetchUsers = async (userPage, search) => {
    if ($userPageInfo.loading) {
      return
    }
    // need to remove the page if they've started searching
    if (search && !prevUserSearch) {
      userPageInfo.reset()
      userPage = undefined
    }
    prevUserSearch = search
    try {
      userPageInfo.loading()
      await users.search({ userPage, email: search })
      userPageInfo.fetched($users.hasNextPage, $users.nextPage)
    } catch (error) {
      notifications.error("Error getting user list")
    }
  }

  const fetchLogs = async (
    logsPage,
    search,
    startDate,
    endDate,
    selectedUsers,
    selectedApps,
    selectedEvents
  ) => {
    if ($logsPageInfo.loading) {
      return
    }
    // need to remove the page if they've started searching
    if (search && !prevLogSearch) {
      logsPageInfo.reset()
      logsPage = undefined
    }
    prevLogSearch = search
    try {
      logsPageInfo.loading()
      await auditLogs.search({
        logsPage,
        startDate,
        endDate,
        metadataSearch: search,
        userIds: selectedUsers,
        appIds: selectedApps,
        events: selectedEvents,
      })
      logsPageInfo.fetched(
        $auditLogs.logs.hasNextPage,
        $auditLogs.logs.nextPage
      )
    } catch (error) {
      console.log(error)
      notifications.error("Error getting audit logs")
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
    sidePanelVisible = true
  }

  const downloadLogs = async () => {
    try {
      await auditLogs.download({
        startDate,
        endDate,
        metadataSearch: logSearchTerm,
        userIds: selectedUsers,
        appIds: selectedApps,
      })
    } catch (error) {
      notifications.error(`Error downloading logs: ` + error.message)
    }
  }

  setContext("auditLogs", {
    viewDetails,
  })

  onMount(async () => {
    await auditLogs.getEventDefinitions()
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
  <div class="datepicker" />

  <div class="controls">
    <div class="search">
      <div>
        <DatePicker
          range={true}
          label="Date Range"
          on:change={e => {
            if (e.detail[0].length > 1) {
              startDate = e.detail[0][0].toISOString()
              endDate = e.detail[0][1].toISOString()
            }
          }}
        />
      </div>
      <div class="select">
        <Multiselect
          bind:fetchTerm={userSearchTerm}
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
          autocomplete
          placeholder="All apps"
          label="App"
          getOptionValue={app => app.instance._id}
          getOptionLabel={app => app.name}
          options={$apps}
          bind:value={selectedApps}
        />
      </div>
      <div class="select">
        <Multiselect
          autocomplete
          getOptionValue={event => event[0]}
          getOptionLabel={event => event[1]}
          options={Object.entries($auditLogs.events)}
          placeholder="All events"
          label="Event"
          bind:value={selectedEvents}
        />
      </div>
    </div>
    <div style="padding-bottom: var(--spacing-s)">
      <Icon on:click={() => downloadLogs()} name="Download" />
    </div>

    <div style="max-width: 150px; ">
      <Search placeholder="Search" bind:value={logSearchTerm} />
    </div>
  </div>
  <Layout noPadding>
    <Table
      {customRenderers}
      on:click={viewDetails}
      data={$auditLogs.logs.data}
      allowEditColumns={false}
      allowEditRows={false}
      allowSelectRows={false}
      {schema}
    />
  </Layout>
</LockedFeature>

{#if selectedLog}
  <div
    id="side-panel"
    class:wide={wideSidePanel}
    class:visible={sidePanelVisible}
    use:clickOutside={() => {
      sidePanelVisible = false
    }}
  >
    <div class="side-panel-header">
      Audit Log
      <div class="side-panel-icons">
        <Icon
          size="S"
          hoverable
          name={wideSidePanel ? "Minimize" : "Maximize"}
          on:click={() => {
            wideSidePanel = !wideSidePanel
          }}
        />
        <Icon
          hoverable
          name="Close"
          on:click={() => {
            sidePanelVisible = false
          }}
        />
      </div>
    </div>
    <div style="padding-top: 10px; height: 95%">
      <CoreTextArea
        disabled
        minHeight={"300px"}
        height={"100%"}
        value={JSON.stringify(selectedLog.metadata, null, 2)}
      />
    </div>
  </div>
{/if}

<style>
  .side-panel-header {
    display: flex;
    gap: var(--spacing-s);
    justify-content: space-between;
    align-items: center;
  }

  #side-panel {
    position: absolute;
    right: 0;
    top: 0;
    padding: 24px;
    background: var(--background);
    border-left: var(--border-light);
    width: 320px;
    max-width: calc(100vw - 48px - 48px);
    overflow: auto;
    overflow-x: hidden;
    transform: translateX(100%);
    transition: transform 130ms ease-in-out;
    height: calc(100% - 48px);
    z-index: 2;
  }
  #side-panel.visible {
    transform: translateX(0);
  }

  #side-panel.wide {
    width: 500px;
  }

  #side-panel :global(textarea) {
    min-height: 202px !important;
    background-color: var(
      --spectrum-textfield-m-background-color,
      var(--spectrum-global-color-gray-50)
    );
    color: var(
      --spectrum-textfield-m-text-color,
      var(--spectrum-alias-text-color)
    );
  }

  .search :global(.spectrum-InputGroup) {
    width: 100px;
  }

  .controls {
    display: flex;
    flex-direction: row;
    gap: var(--spacing-l);
    flex-wrap: wrap;
    align-items: flex-end;
  }

  .side-panel-icons {
    display: flex;
    gap: var(--spacing-l);
  }

  .select {
    flex-basis: 130px;
    width: 0;
    min-width: 100px;
  }

  .search {
    flex: 1 1 auto;
    display: flex;
    gap: var(--spacing-xl);
    align-items: flex-end;
  }
</style>
