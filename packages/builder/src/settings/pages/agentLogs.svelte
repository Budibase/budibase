<script>
  import { licensing } from "@/stores/portal/licensing"
  import { users } from "@/stores/portal/users"
  import { appsStore } from "@/stores/portal/apps"
  import { agentLogs } from "@/stores/portal/agentLogs"

  import LockedFeature from "@/pages/builder/_components/LockedFeature.svelte"
  import {
    Multiselect,
    Search,
    ActionButton,
    Layout,
    Table,
    Pagination,
    clickOutside,
    Icon,
    Divider,
    notifications,
    CoreTextArea,
  } from "@budibase/bbui"
  import { createPaginationStore } from "@/helpers/pagination"
  import { onMount, setContext } from "svelte"
  import DateRangePicker from "@/components/common/DateRangePicker.svelte"
  import dayjs from "dayjs"
  import ViewDetailsRenderer from "./auditLogs/_components/ViewDetailsRenderer.svelte"
  import UserRenderer from "./auditLogs/_components/UserRenderer.svelte"
  import TimeRenderer from "./auditLogs/_components/TimeRenderer.svelte"
  import AppColumnRenderer from "./auditLogs/_components/AppColumnRenderer.svelte"

  const schema = {
    date: { width: "0.8fr" },
    user: { width: "0.5fr" },
    name: { width: "2fr", displayName: "Conversation" },
    trigger: { width: "0.7fr", displayName: "Trigger" },
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

  const triggerOptions = [
    { id: "Chat", label: "Chat" },
    { id: "Chat Preview", label: "Chat Preview" },
    { id: "Slack", label: "Slack" },
    { id: "Microsoft Teams", label: "Microsoft Teams" },
    { id: "Discord", label: "Discord" },
    { id: "Telegram", label: "Telegram" },
    { id: "Automation", label: "Automation" },
    { id: "Test", label: "Test" },
  ]

  let userSearchTerm = ""
  let logSearchTerm = ""
  let userPageInfo = createPaginationStore()
  let logsPageInfo = createPaginationStore()

  let dateRange = [dayjs().subtract(30, "days"), dayjs()]

  let prevUserSearch = undefined
  let prevLogSearch = undefined
  let selectedUsers = []
  let selectedApps = []
  let selectedTriggers = []
  let selectedLog
  let sidePanelVisible = false
  let wideSidePanel = false
  let timer

  $: userPage = $userPageInfo.page
  $: logsPage = $logsPageInfo.page
  $: fetchUsers(userPage, userSearchTerm)
  $: fetchLogs({
    logsPage,
    logSearchTerm,
    dateRange,
    selectedUsers,
    selectedApps,
    selectedTriggers,
  })

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
  $: sortedApps = sort(enrich($appsStore.apps, selectedApps, "appId"), "name")
  $: sortedTriggers = sort(
    enrich(triggerOptions, selectedTriggers, "id"),
    "label"
  )
  $: tableData =
    $agentLogs.logs?.data?.map(log => ({
      ...log,
      timestamp: log.lastActivityAt,
      name: `${log.entries?.length || 0} message${
        log.entries?.length === 1 ? "" : "s"
      }`,
      trigger: log.channelProvider || "Chat",
    })) || []
  $: selectedLogNdjson = selectedLog
    ? selectedLog.entries
        .map(entry =>
          JSON.stringify({
            conversationId: selectedLog.conversationId,
            agentId: selectedLog.agentId,
            appId: selectedLog.appId,
            userId: selectedLog.userId,
            trigger: selectedLog.channelProvider || "Chat",
            transient: selectedLog.transient,
            ...entry,
          })
        )
        .join("\n")
    : ""

  const debounceSearch = value => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      logSearchTerm = value
    }, 400)
  }

  const fetchUsers = async (userPage, search) => {
    if ($userPageInfo.loading) {
      return
    }
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
    dateRange,
    selectedUsers,
    selectedApps,
    selectedTriggers,
  }) => {
    if ($logsPageInfo.loading) {
      return
    }
    if (logSearchTerm && !prevLogSearch) {
      logsPageInfo.reset()
      logsPage = undefined
    }
    prevLogSearch = logSearchTerm
    try {
      logsPageInfo.loading()
      await agentLogs.search({
        bookmark: logsPage,
        startDate: dateRange[0] || undefined,
        endDate: dateRange[1] || undefined,
        fullSearch: logSearchTerm,
        userIds: selectedUsers,
        appIds: selectedApps,
        channelProviders: selectedTriggers,
      })
      logsPageInfo.fetched(
        $agentLogs.logs?.hasNextPage,
        $agentLogs.logs?.bookmark
      )
    } catch (error) {
      notifications.error(`Error getting agent logs - ${error}`)
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

  const viewDetails = detail => {
    selectedLog = detail
    sidePanelVisible = true
  }

  const downloadLogs = async () => {
    try {
      window.location = agentLogs.getDownloadUrl({
        startDate: dateRange[0],
        endDate: dateRange[1],
        fullSearch: logSearchTerm,
        userIds: selectedUsers,
        appIds: selectedApps,
        channelProviders: selectedTriggers,
      })
    } catch (error) {
      notifications.error(`Error downloading logs: ` + error.message)
    }
  }

  setContext("auditLogs", {
    viewDetails,
  })

  onMount(async () => {
    await Promise.all([appsStore.load(), licensing.init()])
  })
</script>

<!-- Configure "agentLogsEnabled" to mimic "auditLogsEnabled" -->
<LockedFeature
  title={"Agent logs"}
  planType={"Enterprise plan"}
  description={"View all agent logs that have occured in your Budibase installation"}
  enabled={$licensing.auditLogsEnabled}
  upgradeButtonClick={async () => {
    licensing.goToUpgradePage()
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
        placeholder="All workspaces"
        label="Workspaces"
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
        getOptionValue={trigger => trigger.id}
        getOptionLabel={trigger => trigger.label}
        options={sortedTriggers}
        placeholder="All triggers"
        label="Trigger"
        bind:value={selectedTriggers}
      />
    </div>
    <div class="date-picker">
      <DateRangePicker
        value={dateRange}
        on:change={e => (dateRange = e.detail)}
      />
    </div>
    <div class="search-wrap">
      <div class="freeSearch">
        <Search
          placeholder="Search"
          on:change={e => debounceSearch(e.detail)}
        />
      </div>
      <div class="">
        <ActionButton
          size="M"
          icon="download"
          on:click={() => downloadLogs()}
        />
      </div>
    </div>
  </div>
  <Layout noPadding>
    <Table
      on:click={({ detail }) => viewDetails(detail)}
      {customRenderers}
      data={tableData}
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
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div
    id="side-panel"
    class:wide={wideSidePanel}
    class:visible={sidePanelVisible}
    use:clickOutside={() => {
      sidePanelVisible = false
    }}
  >
    <div class="side-panel-header">
      Agent Log
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
          name="x"
          on:click={() => {
            sidePanelVisible = false
          }}
        />
      </div>
    </div>
    <Divider />

    <div class="side-panel-body">
      <CoreTextArea
        disabled
        minHeight={"300px"}
        height={"100%"}
        value={selectedLogNdjson}
      />
    </div>
  </div>
{/if}

<style>
  .controls {
    display: flex;
    flex-direction: row;
    gap: var(--spacing-l);
    flex-wrap: wrap;
    align-items: flex-end;
  }

  .select {
    flex-basis: calc(33.33% - 10px);
    width: 0;
    min-width: 100px;
  }

  .search-wrap {
    display: flex;
    gap: var(--spacing-s);
    flex-basis: calc(33.33% - 10px);
  }

  .freeSearch {
    flex: 1;
  }

  .date-picker {
    flex-basis: calc(70% - 32px);
    min-width: 100px;
    display: flex;
    flex-direction: row;
  }
  .date-picker :global(.date-range-picker),
  .date-picker :global(.spectrum-Form-item) {
    flex: 1 1 auto;
    width: 0;
  }

  .pagination {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    margin-top: var(--spacing-xl);
  }

  .side-panel-header {
    display: flex;
    padding: 20px 10px 10px 10px;
    gap: var(--spacing-s);
    justify-content: space-between;
    align-items: center;
  }

  .side-panel-icons {
    display: flex;
    gap: var(--spacing-l);
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
    width: 420px;
    max-width: calc(100vw - 48px - 48px);
    display: none;
    height: calc(100% - 24px);
    overflow-y: hidden;
    overflow-x: hidden;
    z-index: 2;
  }

  #side-panel.visible {
    display: block;
  }

  #side-panel.wide {
    width: 640px;
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
</style>
