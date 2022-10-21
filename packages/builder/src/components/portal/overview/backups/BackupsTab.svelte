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

  import AppSizeRenderer from "./AppSizeRenderer.svelte"
  import CreateBackupModal from "./CreateBackupModal.svelte"
  import ActionsRenderer from "./ActionsRenderer.svelte"
  import DateRenderer from "./DateRenderer.svelte"
  import UserRenderer from "./UserRenderer.svelte"
  import StatusRenderer from "./StatusRenderer.svelte"
  import TypeRenderer from "./TypeRenderer.svelte"

  export let app

  let backupData = null
  let modal
  let trigger = null
  let pageInfo = createPaginationStore()
  let startDate
  let endDate

  $: page = $pageInfo.page
  $: fetchBackups(trigger, page, startDate, endDate)

  const triggers = {
    PUBLISH: "publish",
    SCHEDULED: "scheduled",
    MANUAL: "manual",
  }

  const schema = {
    type: {
      displayName: "Type",
    },
    createdAt: {
      displayName: "Date",
    },
    name: {
      displayName: "Name",
    },
    appSize: {
      displayName: "App size",
    },
    createdBy: {
      displayName: "User",
    },
    status: {
      displayName: "Status",
    },
    actions: {
      displayName: null,
    },
  }

  const customRenderers = [
    { column: "appSize", component: AppSizeRenderer },
    { column: "actions", component: ActionsRenderer },
    { column: "createdAt", component: DateRenderer },
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

  async function fetchBackups(trigger, page, startDate, endDate) {
    const response = await backups.searchBackups({
      appId: app.instance._id,
      trigger,
      page,
      startDate,
      endDate,
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

  async function handleButtonClick({ detail }) {
    if (detail.type === "backupDelete") {
      await backups.deleteBackup({
        appId: app.instance._id,
        backupId: detail.backupId,
      })
      await fetchBackups(app.instance._id, trigger, page)
    } else if (detail.type === "backupRestore") {
      await backups.restoreBackup({
        appId: app.instance._id,
        backupId: detail.backupId,
        name: detail.restoreBackupName,
      })
    } else if (detail.type === "backupUpdate") {
      await backups.updateBackup({
        appId: app.instance._id,
        backupId: detail.backupId,
        name: detail.name,
      })
      await fetchBackups(app.instance._id, trigger, page)
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
        <DatePicker
          range={true}
          label={"Filter Range"}
          on:change={e => {
            if (e.detail[0].length > 1) {
              startDate = e.detail[0][0].toISOString()
              endDate = e.detail[0][1].toISOString()
            }
          }}
        />
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
