<!-- If working on this file, you may notice that if you click the download button in the UI
     hot reload will stop working due to the use of window.location. You'll need to reload the pag
     to get it working again.
-->
<script lang="ts">
  import {
    Layout,
    Table,
    Search,
    Multiselect,
    notifications,
    Icon,
    clickOutside,
    CoreTextArea,
    Pagination,
    Helpers,
    Divider,
    ActionButton,
  } from "@budibase/bbui"
  import { licensing } from "@/stores/portal/licensing"
  import { users } from "@/stores/portal/users"
  import { workspacesStore } from "@/stores/portal/workspaces"
  import { auditLogs } from "@/stores/portal/auditLogs"
  import LockedFeature from "@/pages/builder/_components/LockedFeature.svelte"
  import { createPaginationStore } from "@/helpers/pagination"
  import { onDestroy, onMount, setContext, untrack } from "svelte"
  import { derived } from "svelte/store"
  import ViewDetailsRenderer from "./_components/ViewDetailsRenderer.svelte"
  import UserRenderer from "./_components/UserRenderer.svelte"
  import TimeRenderer from "./_components/TimeRenderer.svelte"
  import WorkspaceColumnRenderer from "./_components/WorkspaceColumnRenderer.svelte"
  import { cloneDeep } from "lodash"
  import DateRangePicker from "@/components/common/DateRangePicker.svelte"
  import dayjs from "dayjs"
  import type { Dayjs } from "dayjs"
  import type { AuditLogEnriched, Event, StrippedUser } from "@budibase/types"
  import { AUDIT_LOGS_CONTEXT, type AuditLogsContext } from "./auditLogContext"
  import { createLatestRequestQueue } from "./auditLogUtils"

  interface Selectable {
    selected: boolean
  }

  interface EventOption extends Selectable {
    id: Event
    label: string
  }

  interface UserSearchQuery {
    page?: string | null
    search: string
  }

  interface LogSearchQuery {
    page?: string | null
    search: string
    dateRange: Dayjs[]
    selectedUsers: string[]
    selectedApps: string[]
    selectedEvents: Event[]
  }

  const schema = {
    date: { width: "0.8fr" },
    user: { width: "0.5fr" },
    name: { width: "2fr", displayName: "Event" },
    app: { width: "1.5fr", displayName: "Workspace" },
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
      component: WorkspaceColumnRenderer,
    },
  ]

  let userSearchTerm = $state("")
  let logSearchTerm = $state("")
  const userPageInfo = createPaginationStore()
  const logsPageInfo = createPaginationStore()
  const userPage = derived(userPageInfo, value => value.page)
  const logsPage = derived(logsPageInfo, value => value.page)

  let prevUserSearch = ""
  let prevLogSearch = ""
  let selectedUsers = $state<string[]>([])
  let selectedApps = $state<string[]>([])
  let selectedEvents = $state<Event[]>([])
  let selectedLog = $state<AuditLogEnriched>()
  let sidePanelVisible = $state(false)
  let wideSidePanel = $state(false)
  let timer: ReturnType<typeof setTimeout> | undefined
  let dateRange = $state([dayjs().subtract(30, "days"), dayjs()])
  let usersObj = $state<Record<string, StrippedUser>>({})

  const debounce = (value: string) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      logSearchTerm = value
    }, 400)
  }

  const fetchUsers = async ({ page, search }: UserSearchQuery) => {
    // need to remove the page if they've started searching
    if (search && !prevUserSearch) {
      userPageInfo.reset()
      page = undefined
    }
    prevUserSearch = search
    try {
      userPageInfo.loading()
      const response = await users.search({
        bookmark: page || undefined,
        query: { string: { email: search } },
      })
      usersObj = {
        ...usersObj,
        ...response.data.reduce<Record<string, StrippedUser>>(
          (accumulator, user) => {
            if (user._id) accumulator[user._id] = user
            return accumulator
          },
          {}
        ),
      }
      userPageInfo.fetched(!!response.hasNextPage, response.nextPage || "")
    } catch (error) {
      userPageInfo.loading(false)
      notifications.error("Error getting user list")
    }
  }

  const fetchLogs = async ({
    page,
    search,
    dateRange,
    selectedUsers,
    selectedApps,
    selectedEvents,
  }: LogSearchQuery) => {
    // need to remove the page if they've started searching
    if (search && !prevLogSearch) {
      logsPageInfo.reset()
      page = undefined
    }
    prevLogSearch = search
    try {
      logsPageInfo.loading()
      const response = await auditLogs.search({
        bookmark: page ? Number(page) : undefined,
        startDate: dateRange[0]?.toISOString(),
        endDate: dateRange[1]?.toISOString(),
        fullSearch: search,
        userIds: selectedUsers,
        appIds: selectedApps,
        events: selectedEvents,
      })
      logsPageInfo.fetched(
        !!response?.hasNextPage,
        response?.bookmark?.toString() || ""
      )
    } catch (error) {
      logsPageInfo.loading(false)
      notifications.error(`Error getting audit logs - ${error}`)
    }
  }

  const queueUserSearch = createLatestRequestQueue(fetchUsers)
  const queueLogSearch = createLatestRequestQueue(fetchLogs)

  const enrich = <T extends object>(
    list: T[],
    selected: string[],
    getValue: (item: T) => string | undefined
  ): (T & Selectable)[] => {
    return list.map(item => {
      const value = getValue(item)
      return {
        ...item,
        selected:
          !!value && selected.some(x => x === value || x.includes(value)),
      }
    })
  }

  const sort = <T extends Selectable>(
    list: T[],
    getValue: (item: T) => string
  ): T[] => {
    const sortedList = list.slice()
    sortedList.sort((a, b) => {
      if (a.selected === b.selected) {
        return getValue(a) < getValue(b) ? -1 : 1
      } else if (a.selected) {
        return -1
      } else if (b.selected) {
        return 1
      }
      return 0
    })
    return sortedList
  }

  const parseEventObject = (obj?: Record<string, string>): EventOption[] => {
    // convert obj which is an object of key value pairs to an array of objects
    // with the key as the id and the value as the name
    if (obj) {
      return Object.entries(obj).map(([id, label]) => {
        return { id: id as Event, label: label.trim(), selected: false }
      })
    } else {
      return []
    }
  }

  const sortedUsers = $derived(
    sort(
      enrich(Object.values(usersObj), selectedUsers, user => user._id),
      user => user.email
    )
  )
  const sortedEvents = $derived(
    sort(
      enrich(
        parseEventObject($auditLogs.events),
        selectedEvents,
        event => event.id
      ),
      event => event.label.toLowerCase()
    )
  )
  const sortedWorkspaces = $derived(
    sort(
      enrich($workspacesStore.apps, selectedApps, app => app.appId),
      app => app.name.toLocaleLowerCase()
    )
  )

  $effect(() => {
    const page = $userPage
    const search = userSearchTerm
    untrack(() => queueUserSearch({ page, search }))
  })

  $effect(() => {
    const query: LogSearchQuery = {
      page: $logsPage,
      search: logSearchTerm,
      dateRange: [...dateRange],
      selectedUsers: [...selectedUsers],
      selectedApps: [...selectedApps],
      selectedEvents: [...selectedEvents],
    }
    untrack(() => queueLogSearch(query))
  })

  const viewDetails = (detail: AuditLogEnriched) => {
    selectedLog = detail
    sidePanelVisible = true
  }

  const downloadLogs = async () => {
    try {
      window.location.href = auditLogs.getDownloadUrl({
        startDate: dateRange[0]?.toISOString(),
        endDate: dateRange[1]?.toISOString(),
        fullSearch: logSearchTerm,
        userIds: selectedUsers,
        appIds: selectedApps,
        events: selectedEvents,
      })
    } catch (error) {
      notifications.error(
        `Error downloading logs: ${error instanceof Error ? error.message : error}`
      )
    }
  }

  setContext<AuditLogsContext>(AUDIT_LOGS_CONTEXT, {
    viewDetails,
  })

  const copyToClipboard = async (value: string) => {
    await Helpers.copyToClipboard(value)
    notifications.success("Copied")
  }

  const copySelectedMetadata = () => {
    if (selectedLog) {
      return copyToClipboard(JSON.stringify(selectedLog.metadata))
    }
  }

  function cleanupMetadata(log: AuditLogEnriched) {
    const cloned = cloneDeep(log)
    const { app, user, ...metadata } = cloned
    return {
      ...metadata,
      userId: user._id,
      ...(app ? { appId: app._id } : {}),
    }
  }

  onMount(async () => {
    await auditLogs.getEventDefinitions()
    await licensing.init()
  })

  onDestroy(() => clearTimeout(timer))
</script>

<LockedFeature
  title={"Audit Logs"}
  planType={"Enterprise plan"}
  description={"View all events that have occurred in your Budibase installation"}
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
        getOptionValue={user => user._id || ""}
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
        options={sortedWorkspaces}
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
      <DateRangePicker
        value={dateRange}
        on:change={e => (dateRange = e.detail)}
      />
    </div>
    <div class="search-wrap">
      <div class="freeSearch">
        <Search placeholder="Search" on:change={e => debounce(e.detail)} />
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
      data={$auditLogs.logs?.data}
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
          name="x"
          on:click={() => {
            sidePanelVisible = false
          }}
        />
      </div>
    </div>
    <Divider />

    <div class="side-panel-body">
      <div on:click={copySelectedMetadata} class="copy-icon">
        <Icon name="copy" size="S" />
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
  .search-wrap {
    display: flex;
    gap: var(--spacing-s);
    flex-basis: calc(33.33% - 10px);
  }

  .freeSearch {
    flex: 1;
  }
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
    transition:
      background-color var(--spectrum-global-animation-duration-100, 130ms),
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
    align-items: flex-end;
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
    display: flex;
    flex-direction: row;
  }
  .date-picker :global(.date-range-picker),
  .date-picker :global(.spectrum-Form-item) {
    flex: 1 1 auto;
    width: 0;
  }
</style>
