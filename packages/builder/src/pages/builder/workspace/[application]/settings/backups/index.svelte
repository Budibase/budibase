<script>
  import {
    Button,
    Divider,
    Layout,
    notifications,
    Pagination,
    Select,
    Heading,
    Body,
    Tags,
    Tag,
    Table,
    ButtonGroup,
  } from "@budibase/bbui"
  import { backups, licensing, auth, admin } from "@/stores/portal"
  import { appStore } from "@/stores/builder"
  import { createPaginationStore } from "@/helpers/pagination"
  import TimeAgoRenderer from "./_components/TimeAgoRenderer.svelte"
  import AppSizeRenderer from "./_components/AppSizeRenderer.svelte"
  import ActionsRenderer from "./_components/ActionsRenderer.svelte"
  import UserRenderer from "./_components/UserRenderer.svelte"
  import StatusRenderer from "./_components/StatusRenderer.svelte"
  import TypeRenderer from "./_components/TypeRenderer.svelte"
  import BackupsDefault from "assets/backups-default.png"
  import { BackupTrigger, BackupType } from "@/constants/backend/backups"
  import { onMount } from "svelte"
  import DateRangePicker from "@/components/common/DateRangePicker.svelte"
  import ConfirmDialog from "@/components/common/ConfirmDialog.svelte"

  let loading = true
  let backupData = null
  let pageInfo = createPaginationStore()
  let filterOpt = null
  let dateRange = []
  let selectedRows = []
  let bulkDeleteDialog
  let filters = [
    {
      label: "Manual backup",
      value: { type: BackupType.BACKUP, trigger: BackupTrigger.MANUAL },
    },
    {
      label: "Published backup",
      value: { type: BackupType.BACKUP, trigger: BackupTrigger.PUBLISH },
    },
    {
      label: "Pre-restore backup",
      value: { type: BackupType.BACKUP, trigger: BackupTrigger.RESTORING },
    },
    {
      label: "Manual restore",
      value: { type: BackupType.RESTORE, trigger: BackupTrigger.MANUAL },
    },
  ]

  $: page = $pageInfo.page
  $: fetchBackups(filterOpt, page, dateRange)

  let schema = {
    type: {
      displayName: "Type",
      width: "auto",
    },
    createdAt: {
      displayName: "Date",
      width: "auto",
    },
    appSize: {
      displayName: "App size",
      width: "auto",
    },
    createdBy: {
      displayName: "User",
      width: "auto",
    },
    status: {
      displayName: "Status",
      width: "auto",
    },
    actions: {
      displayName: null,
      width: "auto",
    },
  }

  const customRenderers = [
    { column: "appSize", component: AppSizeRenderer },
    { column: "actions", component: ActionsRenderer },
    { column: "createdAt", component: TimeAgoRenderer },
    { column: "createdBy", component: UserRenderer },
    { column: "status", component: StatusRenderer },
    { column: "type", component: TypeRenderer },
  ]

  function flattenBackups(backups) {
    return backups.map(backup => {
      return {
        ...backup,
        ...backup?.contents,
      }
    })
  }

  function deselectAll() {
    selectedRows = []
  }

  async function bulkDeleteBackups() {
    if (selectedRows.length === 0) return

    try {
      loading = true
      const backupIds = selectedRows.map(row => row._id)
      const response = await backups.deleteBackups($appStore.appId, backupIds)

      if (response.failureCount > 0) {
        notifications.warning(response.message)
      } else {
        notifications.success(response.message)
      }

      deselectAll()
      await fetchBackups(filterOpt, page)
    } catch (err) {
      notifications.error("Error while deleting the selected backups")
    } finally {
      loading = false
    }
  }

  $: hasSelection = selectedRows.length > 0

  async function fetchBackups(filters, page, dateRange = []) {
    const opts = {
      ...filters,
      page,
    }
    const [startDate, endDate] = dateRange
    if (startDate) {
      opts.startDate = startDate
    }
    if (endDate) {
      opts.endDate = endDate
    }
    const response = await backups.searchBackups($appStore.appId, opts)
    pageInfo.fetched(response.hasNextPage, response.nextPage)

    // flatten so we have an easier structure to use for the table schema
    backupData = flattenBackups(response.data)

    // Clear selections when fetching new data
    deselectAll()
  }

  async function createManualBackup() {
    try {
      loading = true
      let response = await backups.createManualBackup($appStore.appId)
      await fetchBackups(filterOpt, page)
      notifications.success(response.message)
    } catch (err) {
      notifications.error("Unable to create backup")
    }
  }

  const poll = backupData => {
    if (backupData === null) {
      return
    }

    if (backupData.some(datum => datum.status === "started")) {
      setTimeout(() => fetchBackups(filterOpt, page), 2000)
    } else {
      loading = false
    }
  }

  $: poll(backupData)

  async function handleButtonClick({ detail }) {
    if (detail.type === "backupDelete") {
      await backups.deleteBackup($appStore.appId, detail.backupId)
      await fetchBackups(filterOpt, page)
    } else if (detail.type === "backupRestore") {
      await backups.restoreBackup(
        $appStore.appId,
        detail.backupId,
        detail.restoreBackupName
      )
      await fetchBackups(filterOpt, page)
    }
  }

  onMount(async () => {
    await fetchBackups(filterOpt, page, dateRange)
    loading = false
  })
</script>

<Layout noPadding>
  <Layout gap="XS" noPadding>
    <div class="title">
      <Heading>Backups</Heading>
      {#if !$licensing.backupsEnabled}
        <Tags>
          <Tag icon="lock" emphasized>Premium</Tag>
        </Tags>
      {/if}
    </div>
    <Body>Back up your apps and restore them to their previous state</Body>
  </Layout>
  <Divider />

  {#if !$licensing.backupsEnabled}
    {#if !$auth.accountPortalAccess && $admin.cloud}
      <Body>Contact your account holder to upgrade your plan.</Body>
    {/if}
    <ButtonGroup>
      {#if $admin.cloud && $auth.accountPortalAccess}
        <Button primary on:click={$licensing.goToUpgradePage}>Upgrade</Button>
      {/if}
      <Button
        secondary
        on:click={() => window.open("https://budibase.com/pricing/", "_blank")}
      >
        View plans
      </Button>
    </ButtonGroup>
  {:else if !backupData?.length && !loading && !filterOpt && !dateRange?.length}
    <div class="center">
      <Layout noPadding gap="S" justifyItems="center">
        <img height="130px" src={BackupsDefault} alt="BackupsDefault" />
        <Layout noPadding gap="XS">
          <Heading>You have no backups yet</Heading>
          <Body>You can manually back up your app any time</Body>
        </Layout>
        <div>
          <Button cta disabled={loading} on:click={createManualBackup}>
            Create backup
          </Button>
        </div>
      </Layout>
    </div>
  {:else}
    <Layout noPadding gap="M" alignContent="start">
      <div class="controls">
        <div class="search">
          <div class="select">
            <Select
              placeholder="All"
              label="Type"
              options={filters}
              getOptionValue={filter => filter.value}
              getOptionLabel={filter => filter.label}
              bind:value={filterOpt}
            />
          </div>
          <div class="date-range-compact">
            <DateRangePicker
              value={dateRange}
              on:change={e => (dateRange = e.detail)}
            />
          </div>
        </div>
        <div class="actions">
          {#if hasSelection}
            <div class="selection-controls">
              <Button warning on:click={bulkDeleteDialog.show}>
                Delete selected ({selectedRows.length})
              </Button>
            </div>
          {/if}
          <Button cta disabled={loading} on:click={createManualBackup}>
            Create backup
          </Button>
        </div>
      </div>
      <div class="table">
        <Table
          {schema}
          disableSorting
          allowSelectRows={true}
          allowEditColumns={false}
          allowEditRows={false}
          data={backupData}
          {customRenderers}
          placeholderText="No backups found"
          border={false}
          bind:selectedRows
          on:buttonclick={handleButtonClick}
        />
        <div class="pagination">
          <Pagination
            page={$pageInfo.pageNumber}
            hasPrevPage={$pageInfo.loading ? false : $pageInfo.hasPrevPage}
            hasNextPage={$pageInfo.loading ? false : $pageInfo.hasNextPage}
            goToPrevPage={pageInfo.prevPage}
            goToNextPage={pageInfo.nextPage}
          />
        </div>
      </div>
    </Layout>
  {/if}
</Layout>

<ConfirmDialog
  bind:this={bulkDeleteDialog}
  okText="Delete backups"
  onOk={bulkDeleteBackups}
  title="Confirm backup deletion"
>
  Are you sure you wish to delete {selectedRows.length} backup{selectedRows.length ===
  1
    ? ""
    : "s"}? This action cannot be undone.
</ConfirmDialog>

<style>
  .title {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: var(--spacing-xl);
  }

  .controls {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-end;
    gap: var(--spacing-xl);
    flex-wrap: wrap;
  }

  .actions {
    display: flex;
    flex-direction: row;
    gap: var(--spacing-m);
    align-items: flex-end;
  }

  .selection-controls {
    display: flex;
    gap: var(--spacing-s);
    align-items: center;
  }

  .search {
    flex: 1 1 auto;
    display: flex;
    gap: var(--spacing-xl);
    align-items: flex-end;
  }
  .date-range-compact :global(.date-range-picker) {
    max-width: 280px;
    flex: 0 0 280px;
  }
  .date-range-compact :global(.date-range-picker > *) {
    flex: 1 1 0;
    min-width: 0;
  }
  .date-range-compact :global(.date-range-picker .spectrum-InputGroup) {
    width: 100%;
  }
  .search :global(.spectrum-InputGroup) {
    min-width: 100px;
  }

  .select {
    flex-basis: 160px;
    width: 0;
    min-width: 100px;
  }

  .pagination {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    margin-top: var(--spacing-xl);
  }

  .title {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: var(--spacing-l);
  }

  .center {
    text-align: center;
    display: contents;
  }
</style>
