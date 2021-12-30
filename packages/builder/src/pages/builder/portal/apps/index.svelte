<script>
  import {
    Heading,
    Layout,
    Button,
    ActionButton,
    ActionGroup,
    ButtonGroup,
    Input,
    Select,
    Modal,
    Page,
    notifications,
    Search,
  } from "@budibase/bbui"
  import Spinner from "components/common/Spinner.svelte"
  import CreateAppModal from "components/start/CreateAppModal.svelte"
  import UpdateAppModal from "components/start/UpdateAppModal.svelte"
  import { store, automationStore } from "builderStore"
  import api, { del, post, get } from "builderStore/api"
  import { onMount } from "svelte"
  import { apps, auth, admin } from "stores/portal"
  import download from "downloadjs"
  import { goto } from "@roxi/routify"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"
  import AppCard from "components/start/AppCard.svelte"
  import AppRow from "components/start/AppRow.svelte"
  import { AppStatus } from "constants"
  import analytics, { Events } from "analytics"

  let layout = "grid"
  let sortBy = "name"
  let template
  let selectedApp
  let creationModal
  let updatingModal
  let deletionModal
  let unpublishModal
  let creatingApp = false
  let loaded = false
  let searchTerm = ""
  let cloud = $admin.cloud
  let appName = ""
  let creatingFromTemplate = false

  $: enrichedApps = enrichApps($apps, $auth.user, sortBy)
  $: filteredApps = enrichedApps.filter(app =>
    app?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const enrichApps = (apps, user, sortBy) => {
    const enrichedApps = apps.map(app => ({
      ...app,
      deployed: app.status === AppStatus.DEPLOYED,
      lockedYou: app.lockedBy && app.lockedBy.email === user?.email,
      lockedOther: app.lockedBy && app.lockedBy.email !== user?.email,
    }))

    if (sortBy === "status") {
      return enrichedApps.sort((a, b) => {
        if (a.status === b.status) {
          return a.name?.toLowerCase() < b.name?.toLowerCase() ? -1 : 1
        }
        return a.status === AppStatus.DEPLOYED ? -1 : 1
      })
    } else if (sortBy === "updated") {
      return enrichedApps.sort((a, b) => {
        const aUpdated = a.updatedAt || "9999"
        const bUpdated = b.updatedAt || "9999"
        return aUpdated < bUpdated ? 1 : -1
      })
    } else {
      return enrichedApps.sort((a, b) => {
        return a.name?.toLowerCase() < b.name?.toLowerCase() ? -1 : 1
      })
    }
  }

  const initiateAppCreation = () => {
    creationModal.show()
    creatingApp = true
  }

  const initiateAppsExport = () => {
    try {
      download(`/api/cloud/export`)
      notifications.success("Apps exported successfully")
    } catch (err) {
      notifications.error(`Error exporting apps: ${err}`)
    }
  }

  const initiateAppImport = () => {
    template = { fromFile: true }
    creationModal.show()
    creatingApp = true
  }

  const autoCreateApp = async () => {
    try {
      // Auto name app if has same name
      let appName = template.key
      const appsWithSameName = $apps.filter(app =>
        app.name?.startsWith(appName)
      )
      appName = `${appName}-${appsWithSameName.length + 1}`

      // Create form data to create app
      let data = new FormData()
      data.append("name", appName)
      data.append("useTemplate", true)
      data.append("templateKey", template.key)

      // Create App
      const appResp = await post("/api/applications", data, {})
      const appJson = await appResp.json()
      if (!appResp.ok) {
        throw new Error(appJson.message)
      }

      analytics.captureEvent(Events.APP.CREATED, {
        name: appName,
        appId: appJson.instance._id,
        template,
        fromTemplateMarketplace: true,
      })

      // Select Correct Application/DB in prep for creating user
      const applicationPkg = await get(
        `/api/applications/${appJson.instance._id}/appPackage`
      )
      const pkg = await applicationPkg.json()
      if (applicationPkg.ok) {
        await store.actions.initialise(pkg)
        await automationStore.actions.fetch()
        // update checklist - incase first app
        await admin.init()
      } else {
        throw new Error(pkg)
      }

      // Create user
      const userResp = await api.post(`/api/users/metadata/self`, {
        roleId: "BASIC",
      })
      await userResp.json()
      await auth.setInitInfo({})
      $goto(`/builder/app/${appJson.instance._id}`)
    } catch (error) {
      console.error(error)
      notifications.error(error)
    }
  }

  const stopAppCreation = () => {
    template = null
    creatingApp = false
  }

  const viewApp = app => {
    const id = app.deployed ? app.prodId : app.devId
    window.open(`/${id}`, "_blank")
  }

  const editApp = app => {
    if (app.lockedOther) {
      notifications.error(
        `App locked by ${app.lockedBy.email}. Please allow lock to expire or have them unlock this app.`
      )
      return
    }
    $goto(`../../app/${app.devId}`)
  }

  const exportApp = app => {
    const id = app.deployed ? app.prodId : app.devId
    const appName = encodeURIComponent(app.name)
    window.location = `/api/backups/export?appId=${id}&appname=${appName}`
  }

  const unpublishApp = app => {
    selectedApp = app
    unpublishModal.show()
  }

  const confirmUnpublishApp = async () => {
    if (!selectedApp) {
      return
    }
    try {
      const response = await del(
        `/api/applications/${selectedApp.prodId}?unpublish=1`
      )
      if (response.status !== 200) {
        const json = await response.json()
        throw json.message
      }
      await apps.load()
      notifications.success("App unpublished successfully")
    } catch (err) {
      notifications.error(`Error unpublishing app: ${err}`)
    }
  }

  const deleteApp = app => {
    selectedApp = app
    deletionModal.show()
  }

  const confirmDeleteApp = async () => {
    if (!selectedApp) {
      return
    }
    try {
      const response = await del(`/api/applications/${selectedApp?.devId}`)
      if (response.status !== 200) {
        const json = await response.json()
        throw json.message
      }
      await apps.load()
      // get checklist, just in case that was the last app
      await admin.init()
      notifications.success("App deleted successfully")
    } catch (err) {
      notifications.error(`Error deleting app: ${err}`)
    }
    selectedApp = null
    appName = null
  }

  const updateApp = async app => {
    selectedApp = app
    updatingModal.show()
  }

  const releaseLock = async app => {
    try {
      const response = await del(`/api/dev/${app.devId}/lock`)
      if (response.status !== 200) {
        const json = await response.json()
        throw json.message
      }
      await apps.load()
      notifications.success("Lock released successfully")
    } catch (err) {
      notifications.error(`Error releasing lock: ${err}`)
    }
  }

  function createAppFromTemplateUrl(templateKey) {
    // validate the template key just to make sure
    const templateParts = templateKey.split("/")
    if (templateParts.length === 2 && templateParts[0] === "app") {
      template = {
        key: templateKey,
      }
      autoCreateApp()
    } else {
      notifications.error("Your Template URL is invalid. Please try another.")
    }
  }

  onMount(async () => {
    await apps.load()
    // if the portal is loaded from an external URL with a template param
    const initInfo = await auth.getInitInfo()
    if (initInfo?.init_template) {
      creatingFromTemplate = true
      createAppFromTemplateUrl(initInfo.init_template)
      return
    }
    loaded = true
  })
</script>

<Page wide>
  {#if loaded && enrichedApps.length}
    <Layout noPadding>
      <div class="title">
        <Heading>Apps</Heading>
        <ButtonGroup>
          {#if cloud}
            <Button secondary on:click={initiateAppsExport}>Export apps</Button>
          {/if}
          <Button secondary on:click={initiateAppImport}>Import app</Button>
          <Button cta on:click={initiateAppCreation}>Create app</Button>
        </ButtonGroup>
      </div>
      <div class="filter">
        <div class="select">
          <Select
            autoWidth
            bind:value={sortBy}
            placeholder={null}
            options={[
              { label: "Sort by name", value: "name" },
              { label: "Sort by recently updated", value: "updated" },
              { label: "Sort by status", value: "status" },
            ]}
          />
          <div class="desktop-search">
            <Search placeholder="Search" bind:value={searchTerm} />
          </div>
        </div>
        <ActionGroup>
          <ActionButton
            on:click={() => (layout = "grid")}
            selected={layout === "grid"}
            quiet
            icon="ClassicGridView"
          />
          <ActionButton
            on:click={() => (layout = "table")}
            selected={layout === "table"}
            quiet
            icon="ViewRow"
          />
        </ActionGroup>
      </div>
      <div class="mobile-search">
        <Search placeholder="Search" bind:value={searchTerm} />
      </div>
      <div
        class:appGrid={layout === "grid"}
        class:appTable={layout === "table"}
      >
        {#each filteredApps as app (app.appId)}
          <svelte:component
            this={layout === "grid" ? AppCard : AppRow}
            {releaseLock}
            {app}
            {unpublishApp}
            {viewApp}
            {editApp}
            {exportApp}
            {deleteApp}
            {updateApp}
          />
        {/each}
      </div>
    </Layout>
  {/if}
  {#if !enrichedApps.length && !creatingApp && loaded}
    <div class="empty-wrapper">
      <Modal inline>
        <CreateAppModal {template} inline={true} />
      </Modal>
    </div>
  {/if}
  {#if creatingFromTemplate}
    <div class="empty-wrapper">
      <p>Creating your Budibase app from your selected template...</p>
      <Spinner size="10" />
    </div>
  {/if}
</Page>
<Modal
  bind:this={creationModal}
  padding={false}
  width="600px"
  on:hide={stopAppCreation}
>
  <CreateAppModal {template} />
</Modal>
<ConfirmDialog
  bind:this={deletionModal}
  title="Confirm deletion"
  okText="Delete app"
  onOk={confirmDeleteApp}
  onCancel={() => (appName = null)}
  disabled={appName !== selectedApp?.name}
>
  Are you sure you want to delete the app <b>{selectedApp?.name}</b>?

  <p>Please enter the app name below to confirm.</p>
  <Input
    bind:value={appName}
    data-cy="delete-app-confirmation"
    placeholder={selectedApp?.name}
  />
</ConfirmDialog>
<ConfirmDialog
  bind:this={unpublishModal}
  title="Confirm unpublish"
  okText="Unpublish app"
  onOk={confirmUnpublishApp}
>
  Are you sure you want to unpublish the app <b>{selectedApp?.name}</b>?
</ConfirmDialog>

<UpdateAppModal app={selectedApp} bind:this={updatingModal} />

<style>
  .title,
  .filter {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
  }

  @media only screen and (max-width: 560px) {
    .title {
      flex-direction: column;
      align-items: flex-start;
    }
  }

  .select {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 10px;
  }
  .filter :global(.spectrum-ActionGroup) {
    flex-wrap: nowrap;
  }
  .mobile-search {
    display: none;
  }

  .appGrid {
    display: grid;
    grid-gap: 50px;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
  .appTable {
    display: grid;
    grid-template-rows: auto;
    grid-template-columns: 1fr 1fr 1fr 1fr auto;
    align-items: center;
  }
  .appTable :global(> div) {
    height: 70px;
    display: grid;
    align-items: center;
    grid-gap: var(--spacing-xl);
    grid-template-columns: auto 1fr;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 0 var(--spacing-s);
  }
  .appTable :global(> div) {
    border-bottom: var(--border-light);
  }
  .empty-wrapper {
    flex: 1 1 auto;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  @media (max-width: 640px) {
    .appTable {
      grid-template-columns: 1fr auto;
    }
    .desktop-search {
      display: none;
    }
    .mobile-search {
      display: block;
    }
  }
</style>
