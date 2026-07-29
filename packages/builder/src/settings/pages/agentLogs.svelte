<script>
  import { licensing } from "@/stores/portal/licensing"

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
  } from "@budibase/bbui"
  import DateRangePicker from "@/components/common/DateRangePicker.svelte"
  import dayjs from "dayjs"
  import { debounce } from "lodash"

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

  let dateRange = [dayjs().subtract(30, "days"), dayjs()]

  let selectedUsers = []
  let selectedApps = []
  let selectedEvents = []
  let selectedLog
  let sidePanelVisible = false
  let wideSidePanel = false

  const viewDetails = detail => {
    selectedLog = detail
    sidePanelVisible = true
  }

  //   Copied from Audit logs, will need to be fixed later
  //   const downloadLogs = async () => {
  //     try {
  //       window.location = auditLogs.getDownloadUrl({
  //         startDate: dateRange[0],
  //         endDate: dateRange[1],
  //         fullSearch: logSearchTerm,
  //         userIds: selectedUsers,
  //         appIds: selectedApps,
  //         events: selectedEvents,
  //       })
  //     } catch (error) {
  //       notifications.error(`Error downloading logs: ` + error.message)
  //     }
  //   }
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
      <!-- Fix options -->
      <Multiselect
        bind:searchTerm={userSearchTerm}
        placeholder="All users"
        label="Users"
        autocomplete
        bind:value={selectedUsers}
        getOptionValue={user => user._id}
        getOptionLabel={user => user.email}
        options={[]}
      />
    </div>
    <div class="select">
      <!-- Fix options -->
      <Multiselect
        autocomplete
        placeholder="All workspaces"
        label="Workspaces"
        getOptionValue={app => app.instance._id}
        getOptionLabel={app => app.name}
        options={[]}
        bind:value={selectedApps}
      />
    </div>
    <div class="select">
      <!-- Fix options -->
      <Multiselect
        customPopoverHeight="500px"
        autocomplete
        getOptionValue={event => event.id}
        getOptionLabel={event => event.label}
        options={[]}
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
  <Layout npPadding>
    <Table
      on:click={({ detail }) => viewDetails(detail)}
      {customRenderers}
    //   data={$agentLogs.logs?.data}
      allowEditColumns={false}
      allowEditRows={false}
      allowSelectRows={false}
      {schema}
    />
    <div class="pagination">
      <Pagination />
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
      Agent Log <div class="side-panel-icons">
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
      <h1>Side Panel Body</h1>
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
</style>
