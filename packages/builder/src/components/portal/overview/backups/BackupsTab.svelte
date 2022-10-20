<script>
  import {
    ActionButton,
    DatePicker,
    Layout,
    Modal,
    notifications,
    Pagination,
    Select,
    Table,
  } from "@budibase/bbui"
  import { backups } from "stores/portal"
  import { createPaginationStore } from "helpers/pagination"

  import DatasourceRenderer from "./DatasourceRenderer.svelte"
  import ScreensRenderer from "./ScreensRenderer.svelte"
  import AutomationsRenderer from "./AutomationsRenderer.svelte"
  import CreateBackupModal from "./CreateBackupModal.svelte"
  import TriggerRenderer from "./TriggerRenderer.svelte"
  import ActionsRenderer from "./ActionsRenderer.svelte"
  import DateRenderer from "./DateRenderer.svelte"
  import DaysRenderer from "./DaysRenderer.svelte"

  export let app

  let backupData = null
  let modal
  let trigger = null
  let pageInfo = createPaginationStore()
  $: page = $pageInfo.page

  $: fetchBackups(trigger, page)

  const triggers = {
    PUBLISH: "publish",
    SCHEDULED: "scheduled",
    MANUAL: "manual",
  }

  const schema = {
    trigger: {
      displayName: "Trigger",
    },
    days: {
      displayName: null,
    },

    name: {
      displayName: "Name",
    },
    createdAt: {
      displayName: "Date",
    },
    datasources: {
      displayName: "Data",
    },
    screens: {
      displayName: "Screens",
    },
    automations: {
      displayName: "Automations",
    },
    userId: {
      displayName: "User",
    },
    actions: {
      displayName: null,
    },
  }

  const customRenderers = [
    { column: "datasources", component: DatasourceRenderer },
    { column: "screens", component: ScreensRenderer },
    { column: "automations", component: AutomationsRenderer },
    { column: "trigger", component: TriggerRenderer },
    { column: "actions", component: ActionsRenderer },
    { column: "createdAt", component: DateRenderer },
    { column: "days", component: DaysRenderer },
  ]

  function flattenBackups(backups) {
    return backups.map(backup => {
      return {
        ...backup,
        days: getDaysBetween(backup.timestamp),
        ...backup?.contents,
      }
    })
  }

  function getDaysBetween(date) {
    const now = new Date()
    const backupDate = new Date(date)
    backupDate.setDate(backupDate.getDate() - 1)
    const oneDay = 24 * 60 * 60 * 1000
    return now > backupDate
      ? Math.round(Math.abs((now - backupDate) / oneDay))
      : 0
  }

  async function fetchBackups(trigger, page) {
    const response = await backups.searchBackups({
      appId: app.instance._id,
      trigger,
      page,
    })
    pageInfo.fetched(response.hasNextPage, response.nextPage)

    // flatten so we have an easier structure to use for the table schema
    backupData = flattenBackups(response.data)
  }

  async function createManualBackup(name) {
    try {
      let response = await backups.createManualBackup({
        appId: app.instance._id,
        name,
      })
      notifications.success(response.message)
    } catch {
      notifications.error("Unable to create backup")
    }
  }

  async function deleteBackup(backupId) {
    await backups.deleteBackup({ appId: app.instance._id, backupId })
    await fetchBackups(app.instance._id, trigger, page)
  }
  async function restoreBackup(backupId) {
    backups.restoreBackup({ appId: app.instance._id, backupId })
  }

  function handleButtonClick({ detail }) {
    if (detail.type === "backupDelete") {
      deleteBackup(detail.backupId)
    } else if (detail.type === "backupRestore") {
      restoreBackup(detail.backupId)
    }
  }
</script>

<div class="root">
  <Layout noPadding gap="M" alignContent="start">
    <div class="search">
      <div class="select">
        <Select
          placeholder="All"
          label="Trigger"
          options={Object.values(triggers)}
          bind:value={trigger}
        />
      </div>
      <div>
        <DatePicker range label="Filter range" />
      </div>

      <div class="split-buttons">
        <ActionButton on:click={modal.show} icon="SaveAsFloppy"
          >Create new backup</ActionButton
        >
      </div>
    </div>
    {#if backupData}
      <div>
        <Table
          {schema}
          allowSelectRows={false}
          allowEditColumns={false}
          allowEditRows={false}
          data={backupData}
          {customRenderers}
          placeholderText="No backups found"
          border={false}
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
    {/if}
  </Layout>
</div>

<Modal bind:this={modal}>
  <CreateBackupModal {createManualBackup} />
</Modal>

<style>
  .root {
    display: grid;
    grid-template-columns: 1fr;
    height: 100%;
    padding: var(--spectrum-alias-grid-gutter-medium)
      var(--spectrum-alias-grid-gutter-large);
  }

  .search {
    display: flex;
    gap: var(--spacing-xl);
    width: 100%;
    align-items: flex-end;
  }

  .select {
    flex-basis: 150px;
  }

  .pagination {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    margin-top: var(--spacing-xl);
  }

  .split-buttons {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex: 1;
    gap: var(--spacing-xl);
  }
</style>
