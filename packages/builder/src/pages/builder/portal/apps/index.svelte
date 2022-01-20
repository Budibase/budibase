<script>
  import {
    Heading,
    Layout,
    Detail,
    Button,
    Input,
    Select,
    Modal,
    Page,
    notifications,
    Body,
    Search,
    Icon,
  } from "@budibase/bbui"
  import Spinner from "components/common/Spinner.svelte"
  import CreateAppModal from "components/start/CreateAppModal.svelte"
  import UpdateAppModal from "components/start/UpdateAppModal.svelte"
  import ChooseIconModal from "components/start/ChooseIconModal.svelte"

  import { store, automationStore } from "builderStore"
  import api, { del, post, get } from "builderStore/api"
  import { onMount } from "svelte"
  import { apps, auth, admin, templates } from "stores/portal"
  import download from "downloadjs"
  import { goto } from "@roxi/routify"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"
  import AppRow from "components/start/AppRow.svelte"
  import { AppStatus } from "constants"
  import analytics, { Events } from "analytics"
  import Logo from "assets/bb-space-man.svg"

  let sortBy = "name"
  let template
  let selectedApp
  let creationModal
  let updatingModal
  let deletionModal
  let unpublishModal
  let iconModal
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
  $: isCloud = $admin.cloud

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
    template = {}
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
    if (!isCloud && app.deployed) {
      // special case to use the short form name if self hosted
      window.open(`/app/${encodeURIComponent(app.name)}`)
    } else {
      const id = app.deployed ? app.prodId : app.devId
      window.open(`/${id}`, "_blank")
    }
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

  const editIcon = app => {
    selectedApp = app
    iconModal.show()
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
    await templates.load()
    if ($templates?.length === 0) {
      notifications.error("There was a problem loading quick start templates.")
    }
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
  <Layout noPadding gap="XL">
    <div class="title">
      <Layout noPadding gap="XS">
        <Heading size="M">Welcome to Budibase</Heading>
        <Body size="S">
          Manage your apps and get a head start with templates
        </Body>
      </Layout>

      <div class="buttons">
        {#if cloud}
          <Button
            size="L"
            icon="Export"
            quiet
            secondary
            on:click={initiateAppsExport}
          >
            Export apps
          </Button>
        {/if}
        <Button
          icon="Import"
          size="L"
          quiet
          secondary
          on:click={initiateAppImport}
        >
          Import app
        </Button>
        <Button size="L" icon="Add" cta on:click={initiateAppCreation}>
          Create app
        </Button>
      </div>
    </div>

    <Layout noPadding gap="S">
      <Detail size="L">Quick start templates</Detail>
      <div class="grid">
        {#each $templates as item}
          <div
            on:click={() => {
              template = item
              creationModal.show()
              creatingApp = true
            }}
            class="template-card"
          >
            <div class="card-body">
              <div style="color: {item.background}" class="iconAlign">
                <svg
                  width="26px"
                  height="26px"
                  class="spectrum-Icon"
                  style="color:{item.background};"
                  focusable="false"
                >
                  <use xlink:href="#spectrum-icon-18-{item.icon}" />
                </svg>
              </div>
              <div class="iconAlign">
                <Body weight="900" size="S">{item.name}</Body>
                <div style="font-size: 10px;">
                  <Body size="S">{item.category.toUpperCase()}</Body>
                </div>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </Layout>

    {#if loaded && enrichedApps.length}
      <Layout noPadding gap="S">
        <div class="title">
          <Detail size="L">My apps</Detail>
          <div class="filter">
            <Select
              quiet
              autoWidth
              bind:value={sortBy}
              placeholder={null}
              options={[
                { label: "Sort by name", value: "name" },
                { label: "Sort by recently updated", value: "updated" },
                { label: "Sort by status", value: "status" },
              ]}
            />
            <Search placeholder="Search" bind:value={searchTerm} />
          </div>
        </div>

        <div class="appTable">
          {#each filteredApps as app (app.appId)}
            <AppRow
              {releaseLock}
              {editIcon}
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
        <div class="centered">
          <div class="main">
            <Layout gap="S" justifyItems="center">
              <img class="img-size" alt="logo" src={Logo} />
              <div class="new-screen-text">
                <Detail size="M">Create a business app in minutes!</Detail>
              </div>
              <Button on:click={() => initiateAppCreation()} size="M" cta>
                <div class="new-screen-button">
                  <div class="background-icon" style="color: white;">
                    <Icon name="Add" />
                  </div>
                  Create App
                </div></Button
              >
            </Layout>
          </div>
        </div>
      </div>
    {/if}

    {#if creatingFromTemplate}
      <div class="empty-wrapper">
        <p>Creating your Budibase app from your selected template...</p>
        <Spinner size="10" />
      </div>
    {/if}
  </Layout>
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
<ChooseIconModal app={selectedApp} bind:this={iconModal} />

<style>
  .title {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: var(--spacing-xl);
    flex-wrap: wrap;
  }
  .buttons {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: var(--spacing-xl);
    flex-wrap: wrap;
  }
  @media (max-width: 640px) {
    .buttons {
      flex-direction: row-reverse;
      justify-content: flex-end;
    }
  }

  .filter {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: var(--spacing-xl);
  }

  .grid {
    height: 200px;
    display: grid;
    overflow: hidden;
    grid-gap: var(--spacing-xl);
    grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
    grid-template-rows: minmax(70px, 1fr) minmax(100px, 1fr) minmax(0px, 0);
  }
  .template-card {
    height: 70px;
    border-radius: var(--border-radius-s);
    border: 1px solid var(--spectrum-global-color-gray-300);
    cursor: pointer;
    display: flex;
  }

  .template-card:hover {
    background: var(--spectrum-alias-background-color-tertiary);
  }
  .card-body {
    display: flex;
    align-items: center;
    padding: 12px;
  }
  .iconAlign {
    padding: 0 0 0 var(--spacing-m);
    display: inline-block;
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
  @media (max-width: 640px) {
    .appTable {
      grid-template-columns: 1fr auto;
    }
  }

  .empty-wrapper {
    flex: 1 1 auto;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .centered {
    width: calc(100% - 350px);
    height: calc(100% - 100px);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .main {
    width: 300px;
  }

  .new-screen-text {
    width: 160px;
    text-align: center;
    color: #2c2c2c;
    font-weight: 600;
  }

  .new-screen-button {
    margin-left: 5px;
    height: 20px;
    width: 100px;
    display: flex;
    align-items: center;
  }

  .img-size {
    width: 160px;
    height: 160px;
  }

  .background-icon {
    margin-top: 4px;
    margin-right: 4px;
  }
</style>
