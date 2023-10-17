<!-- If working on this file, you may notice that if you click the download button in the UI
     hot reload will stop working due to the use of window.location. You'll need to reload the pag
     to get it working again.
-->
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
    Pagination,
    Helpers,
    Divider,
    ActionButton,
  } from "@budibase/bbui"
  import { licensing, users, apps, auditLogs } from "stores/portal"
  import LockedFeature from "../../_components/LockedFeature.svelte"
  import { createPaginationStore } from "helpers/pagination"
  import { onMount, setContext } from "svelte"
  import ViewDetailsRenderer from "./_components/ViewDetailsRenderer.svelte"
  import UserRenderer from "./_components/UserRenderer.svelte"
  import TimeRenderer from "./_components/TimeRenderer.svelte"
  import AppColumnRenderer from "./_components/AppColumnRenderer.svelte"
  import { cloneDeep } from "lodash"

  const schema = {
    date: { width: "0.8fr" },
    user: { width: "0.5fr" },
    name: { width: "2fr", displayName: "Event" },
    app: { width: "1.5fr" },
    view: { width: "0.1fr", borderLeft: true, displayName: "" },
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
  let timer
  let startDate = new Date()
  startDate.setDate(startDate.getDate() - 30)
  let endDate = new Date()

  $: fetchUsers(userPage, userSearchTerm)
  $: fetchLogs({
    logsPage,
    logSearchTerm,
    startDate,
    endDate,
    selectedUsers,
    selectedApps,
    selectedEvents,
  })
  $: userPage = $userPageInfo.page
  $: logsPage = $logsPageInfo.page

  let usersObj = {}
  $: usersObj = {
    ...usersObj,
    ...$users.data?.reduce((accumulator, user) => {
      accumulator[user._id] = user
      return accumulator
    }, {}),
  }
  $: sortedUsers = sort(
    enrich(Object.values(usersObj), selectedUsers, "_id"),
    "email"
  )
  $: sortedEvents = sort(
    enrich(parseEventObject($auditLogs.events), selectedEvents, "id"),
    "id"
  )
  $: sortedApps = sort(enrich($apps, selectedApps, "appId"), "name")

  const debounce = value => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      logSearchTerm = value
    }, 400)
  }

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
      await users.search({
        bookmark: userPage,
        query: { string: { email: search } },
      })
      userPageInfo.fetched($users.hasNextPage, $users.nextPage)
    } catch (error) {
      notifications.error("Error getting user list")
    }
  }

  const fetchLogs = async ({
    logsPage,
    logSearchTerm,
    startDate,
    endDate,
    selectedUsers,
    selectedApps,
    selectedEvents,
  }) => {
    if ($logsPageInfo.loading) {
      return
    }
    // need to remove the page if they've started searching
    if (logSearchTerm && !prevLogSearch) {
      logsPageInfo.reset()
      logsPage = undefined
    }
    prevLogSearch = logSearchTerm
    try {
      logsPageInfo.loading()
      await auditLogs.search({
        bookmark: logsPage,
        startDate,
        endDate,
        fullSearch: logSearchTerm,
        userIds: selectedUsers,
        appIds: selectedApps,
        events: selectedEvents,
      })
      logsPageInfo.fetched(
        $auditLogs.logs.hasNextPage,
        $auditLogs.logs.bookmark
      )
    } catch (error) {
      notifications.error(`Error getting audit logs - ${error}`)
    }
  }

  const enrich = (list, selected, key) => {
    return list.map(item => {
      return {
        ...item,
        selected:
          selected.find(x => x === item[key] || x.includes(item[key])) != null,
      }
    })
  }

  const sort = (list, key) => {
    let sortedList = list.slice()
    sortedList?.sort((a, b) => {
      if (a.selected === b.selected) {
        return a[key] < b[key] ? -1 : 1
      } else if (a.selected) {
        return -1
      } else if (b.selected) {
        return 1
      }
      return 0
    })
    return sortedList
  }

  const parseEventObject = obj => {
    // convert obj which is an object of key value pairs to an array of objects
    // with the key as the id and the value as the name
    if (obj) {
      return Object.entries(obj).map(([id, label]) => {
        return { id, label }
      })
    }
  }

  const viewDetails = detail => {
    selectedLog = detail
    sidePanelVisible = true
  }

  const downloadLogs = async () => {
    try {
      window.location = auditLogs.getDownloadUrl({
        startDate,
        endDate,
        fullSearch: logSearchTerm,
        userIds: selectedUsers,
        appIds: selectedApps,
        events: selectedEvents,
      })
    } catch (error) {
      notifications.error(`Error downloading logs: ` + error.message)
    }
  }

  setContext("auditLogs", {
    viewDetails,
  })

  const copyToClipboard = async value => {
    await Helpers.copyToClipboard(value)
    notifications.success("Copied")
  }

  function cleanupMetadata(log) {
    const cloned = cloneDeep(log)
    cloned.userId = cloned.user._id
    if (cloned.app) {
      cloned.appId = cloned.app.appId
    }
    // remove props that are confused/not returned in download
    delete cloned._id
    delete cloned._rev
    delete cloned.app
    delete cloned.user
    return cloned
  }

  onMount(async () => {
    await auditLogs.getEventDefinitions()
    await licensing.init()
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
    <div class="select">
      <Multiselect
        bind:searchTerm={userSearchTerm}
        placeholder="All users"
        label="Users"
        autocomplete
        bind:value={selectedUsers}
        getOptionValue={user => user._id}
        getOptionLabel={user => user.email}
        options={sortedUsers}
      />
    </div>
    <div class="select">
      <Multiselect
        autocomplete
        placeholder="All apps"
        label="Apps"
        getOptionValue={app => app.instance._id}
        getOptionLabel={app => app.name}
        options={sortedApps}
        bind:value={selectedApps}
      />
    </div>
    <div class="select">
      <Multiselect
        customPopoverHeight="500px"
        autocomplete
        getOptionValue={event => event.id}
        getOptionLabel={event => event.label}
        options={sortedEvents}
        placeholder="All events"
        label="Events"
        bind:value={selectedEvents}
      />
    </div>

    <div class="date-picker">
      <DatePicker
        value={[startDate, endDate]}
        placeholder="Choose date range"
        range={true}
        on:change={e => {
          if (e.detail[0]?.length === 1) {
            startDate = e.detail[0][0].toISOString()
            endDate = ""
          } else if (e.detail[0]?.length > 1) {
            startDate = e.detail[0][0].toISOString()
            endDate = e.detail[0][1].toISOString()
          } else {
            startDate = ""
            endDate = ""
          }
        }}
      />
    </div>
    <div class="freeSearch">
      <Search placeholder="Search" on:change={e => debounce(e.detail)} />
    </div>

    <div class="">
      <ActionButton size="M" icon="Download" on:click={() => downloadLogs()} />
    </div>
  </div>
  <Layout noPadding>
    <Table
      on:click={({ detail }) => viewDetails(detail)}
      {customRenderers}
      data={$auditLogs.logs.data}
      allowEditColumns={false}
      allowEditRows={false}
      allowSelectRows={false}
      {schema}
    />
    <div class="pagination">
      <Pagination
        page={$logsPageInfo.pageNumber}
        hasPrevPage={$logsPageInfo.loading ? false : $logsPageInfo.hasPrevPage}
        hasNextPage={$logsPageInfo.loading ? false : $logsPageInfo.hasNextPage}
        goToPrevPage={logsPageInfo.prevPage}
        goToNextPage={logsPageInfo.nextPage}
      />
    </div>
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
    <Divider />

    <div class="side-panel-body">
      <div
        on:click={() => copyToClipboard(JSON.stringify(selectedLog.metadata))}
        class="copy-icon"
      >
        <Icon name="Copy" size="S" />
      </div>
      <CoreTextArea
        disabled
        minHeight={"300px"}
        height={"100%"}
        value={JSON.stringify(cleanupMetadata(selectedLog), null, 2)}
      />
    </div>
  </div>
{/if}

<style>
  .copy-icon {
    right: 16px;
    top: 80px;
    z-index: 10;
    justify-content: center;
    align-items: center;
    display: flex;
    flex-direction: row;
    box-sizing: border-box;

    border: 1px solid var(--spectrum-alias-border-color);
    border-radius: var(--spectrum-alias-border-radius-regular);
    width: 31px;
    color: var(--spectrum-alias-text-color);
    background-color: var(--spectrum-global-color-gray-75);
    transition: background-color
        var(--spectrum-global-animation-duration-100, 130ms),
      box-shadow var(--spectrum-global-animation-duration-100, 130ms),
      border-color var(--spectrum-global-animation-duration-100, 130ms);
    height: calc(var(--spectrum-alias-item-height-m) - 2px);
    position: absolute;
  }
  .copy-icon:hover {
    cursor: pointer;
    color: var(--spectrum-alias-text-color-hover);
    background-color: var(--spectrum-global-color-gray-50);
    border-color: var(--spectrum-alias-border-color-hover);
  }
  .side-panel-header {
    display: flex;
    padding: 20px 10px 10px 10px;
    gap: var(--spacing-s);
    justify-content: space-between;
    align-items: center;
  }

  .pagination {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    margin-top: var(--spacing-xl);
  }

  .side-panel-body {
    padding: 10px;
    height: calc(100% - 67px);
  }
  #side-panel {
    position: absolute;
    right: 0;
    top: 0;
    padding-bottom: 24px;
    background: var(--background);
    border-left: var(--border-light);
    width: 320px;
    max-width: calc(100vw - 48px - 48px);
    transform: translateX(100%);
    transition: transform 130ms ease-in-out;
    height: calc(100% - 24px);
    overflow-y: hidden;
    overflow-x: hidden;
    z-index: 2;
  }
  #side-panel.visible {
    transform: translateX(0);
  }

  #side-panel.wide {
    width: 500px;
  }

  #side-panel :global(textarea) {
    min-height: 100% !important;
    background-color: var(
      --spectrum-textfield-m-background-color,
      var(--spectrum-global-color-gray-50)
    );
    padding-top: var(--spacing-l);
    padding-left: var(--spacing-l);
    font-size: 13px;
  }

  .controls {
    display: flex;
    flex-direction: row;
    gap: var(--spacing-l);
    flex-wrap: wrap;
    align-items: center;
  }

  .side-panel-icons {
    display: flex;
    gap: var(--spacing-l);
  }

  .select {
    flex-basis: calc(33.33% - 10px);
    width: 0;
    min-width: 100px;
  }

  .date-picker {
    flex-basis: calc(70% - 32px);
    min-width: 100px;
  }

  .freeSearch {
    flex-basis: 25%;
    min-width: 100px;
  }
</style>
