<script>
  import {
    ActionButton,
    Button,
    DatePicker,
    Divider,
    Layout,
    Modal,
    notifications,
    Pagination,
    Select,
    Heading,
    Body,
    Tags,
    Tag,
    Table,
    Page,
  } from "@budibase/bbui"
  import { backups, licensing, auth, admin } from "stores/portal"
  import { createPaginationStore } from "helpers/pagination"
  import AppSizeRenderer from "./AppSizeRenderer.svelte"
  import CreateBackupModal from "./CreateBackupModal.svelte"
  import ActionsRenderer from "./ActionsRenderer.svelte"
  import DateRenderer from "components/common/renderers/DateTimeRenderer.svelte"
  import UserRenderer from "./UserRenderer.svelte"
  import StatusRenderer from "./StatusRenderer.svelte"
  import TypeRenderer from "./TypeRenderer.svelte"
  import NameRenderer from "./NameRenderer.svelte"
  import BackupsDefault from "assets/backups-default.png"
  import { BackupTrigger, BackupType } from "constants/backend/backups"
  import { onMount } from "svelte"
  export let app

  let backupData = null
  let modal
  let pageInfo = createPaginationStore()
  let filterOpt = null
  let startDate = null
  let endDate = null
  let loaded = false
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
      label: "Scheduled backup",
      value: { type: BackupType.BACKUP, trigger: BackupTrigger.SCHEDULED },
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
  $: fetchBackups(filterOpt, page, startDate, endDate)

  let schema = {
    type: {
      displayName: "Type",
      width: "auto",
    },
    createdAt: {
      displayName: "Date",
      width: "auto",
    },
    name: {
      displayName: "Name",
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
      width: "5%",
    },
  }

  const customRenderers = [
    { column: "appSize", component: AppSizeRenderer },
    { column: "actions", component: ActionsRenderer },
    { column: "createdAt", component: DateRenderer },
    { column: "createdBy", component: UserRenderer },
    { column: "status", component: StatusRenderer },
    { column: "type", component: TypeRenderer },
    { column: "name", component: NameRenderer },
  ]

  function flattenBackups(backups) {
    return backups.map(backup => {
      return {
        ...backup,
        ...backup?.contents,
      }
    })
  }

  async function fetchBackups(filters, page, startDate, endDate) {
    const response = await backups.searchBackups({
      appId: app.instance._id,
      ...filters,
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
      await fetchBackups(filterOpt, page)
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
      await fetchBackups(filterOpt, page)
    } else if (detail.type === "backupRestore") {
      await backups.restoreBackup({
        appId: app.instance._id,
        backupId: detail.backupId,
        name: detail.restoreBackupName,
      })
      await fetchBackups(filterOpt, page)
    } else if (detail.type === "backupUpdate") {
      await backups.updateBackup({
        appId: app.instance._id,
        backupId: detail.backupId,
        name: detail.name,
      })
      await fetchBackups(filterOpt, page)
    }
  }

  onMount(() => {
    fetchBackups(filterOpt, page, startDate, endDate)
    loaded = true
  })
</script>

<div class="root">
  {#if !$licensing.backupsEnabled}
    <Page wide={false}>
      <Layout gap="XS" noPadding>
        <div class="title">
          <Heading size="M">Backups</Heading>
          <Tags>
            <Tag icon="LockClosed">Pro plan</Tag>
          </Tags>
        </div>
        <div>
          <Body>
            Back up your apps and restore them to their previous state.
            {#if !$auth.accountPortalAccess && !$licensing.groupsEnabled && $admin.cloud}
              Contact your account holder to upgrade your plan.
            {/if}
          </Body>
        </div>
        <Divider />
        <div class="pro-buttons">
          {#if $auth.accountPortalAccess}
            <Button
              newStyles
              primary
              disabled={!$auth.accountPortalAccess && $admin.cloud}
              on:click={$licensing.goToUpgradePage()}
            >
              Upgrade
            </Button>
          {/if}
          <!--Show the view plans button-->
          <Button
            newStyles
            secondary
            on:click={() => {
              window.open("https://budibase.com/pricing/", "_blank")
            }}
          >
            View plans
          </Button>
        </div>
      </Layout>
    </Page>
  {:else if backupData?.length === 0 && !loaded && !filterOpt && !startDate}
    <Page wide={false}>
      <div class="align">
        <img
          width="220px"
          height="130px"
          src={BackupsDefault}
          alt="BackupsDefault"
        />
        <Layout gap="S">
          <Heading>You have no backups yet</Heading>
          <div class="opacity">
            <Body size="S">You can manually backup your app any time</Body>
          </div>
          <div class="padding">
            <Button on:click={modal.show} cta>Create Backup</Button>
          </div>
        </Layout>
      </div>
    </Page>
  {:else if loaded}
    <Layout noPadding gap="M" alignContent="start">
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
      <div class="table">
        <Table
          {schema}
          disableSorting
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
    </Layout>
  {/if}
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
    flex-basis: 100px;
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

  .title {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: var(--spacing-m);
  }

  .align {
    margin-top: 5%;
    text-align: center;
  }

  .pro-buttons {
    display: flex;
    gap: var(--spacing-m);
  }

  .table {
    overflow-x: scroll;
  }
</style>
