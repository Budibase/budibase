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
    Divider,
    Helpers,
  } from "@budibase/bbui"
  import TemplateDisplay from "components/common/TemplateDisplay.svelte"
  import Spinner from "components/common/Spinner.svelte"
  import CreateAppModal from "components/start/CreateAppModal.svelte"
  import UpdateAppModal from "components/start/UpdateAppModal.svelte"
  import ChooseIconModal from "components/start/ChooseIconModal.svelte"

  import { store, automationStore } from "builderStore"
  import { API } from "api"
  import { onMount } from "svelte"
  import { apps, auth, admin, templates } from "stores/portal"
  import download from "downloadjs"
  import { goto } from "@roxi/routify"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"
  import AppRow from "components/start/AppRow.svelte"
  import { AppStatus } from "constants"
  import analytics, { Events, EventSource } from "analytics"
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
  let loaded = $apps?.length || $templates?.length
  let searchTerm = ""
  let cloud = $admin.cloud
  let appName = ""
  let creatingFromTemplate = false

  const resolveWelcomeMessage = (auth, apps) => {
    const userWelcome = auth?.user?.firstName
      ? `Welcome ${auth?.user?.firstName}!`
      : "Welcome back!"
    return apps?.length ? userWelcome : "Let's create your first app!"
  }
  $: welcomeHeader = resolveWelcomeMessage($auth, $apps)
  $: welcomeBody = $apps?.length
    ? "Manage your apps and get a head start with templates"
    : "Start from scratch or get a head start with one of our templates"

  $: createAppButtonText = $apps?.length
    ? "Create new app"
    : "Start from scratch"

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
    if ($apps?.length) {
      $goto("/builder/portal/apps/create")
    } else {
      template = null
      creationModal.show()
      creatingApp = true
    }
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
      const createdApp = await API.createApp(data)
      analytics.captureEvent(Events.APP.CREATED, {
        name: appName,
        appId: createdApp.instance._id,
        template,
        fromTemplateMarketplace: true,
      })

      // Select Correct Application/DB in prep for creating user
      const pkg = await API.fetchAppPackage(createdApp.instance._id)
      await store.actions.initialise(pkg)
      await automationStore.actions.fetch()
      // Update checklist - in case first app
      await admin.init()

      // Create user
      await API.updateOwnMetadata({
        roleId: "BASIC",
      })
      await auth.setInitInfo({})
      $goto(`/builder/app/${createdApp.instance._id}`)
    } catch (error) {
      notifications.error("Error creating app")
    }
  }

  const stopAppCreation = () => {
    template = null
    creatingApp = false
  }

  const viewApp = app => {
    analytics.captureEvent(Events.APP.VIEW_PUBLISHED, {
      appId: app.appId,
      eventSource: EventSource.PORTAL,
    })
    if (app.url) {
      window.open(`/app${app.url}`)
    } else {
      window.open(`/${app.prodId}`)
    }
  }

  const previewApp = app => {
    window.open(`/${app.devId}`)
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
      analytics.captureEvent(Events.APP.UNPUBLISHED, {
        appId: selectedApp.appId,
      })
      await API.unpublishApp(selectedApp.prodId)
      await apps.load()
      notifications.success("App unpublished successfully")
    } catch (err) {
      notifications.error("Error unpublishing app")
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
      await API.deleteApp(selectedApp?.devId)
      await apps.load()
      // Get checklist, just in case that was the last app
      await admin.init()
      notifications.success("App deleted successfully")
    } catch (err) {
      notifications.error("Error deleting app")
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
      await API.releaseAppLock(app.devId)
      await apps.load()
      notifications.success("Lock released successfully")
    } catch (err) {
      notifications.error("Error releasing lock")
    }
  }

  const copyAppId = async app => {
    await Helpers.copyToClipboard(app.prodId)
    notifications.success("App ID copied to clipboard.")
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
    try {
      await apps.load()
      await templates.load()
      if ($templates?.length === 0) {
        notifications.error(
          "There was a problem loading quick start templates."
        )
      }
      // If the portal is loaded from an external URL with a template param
      const initInfo = await auth.getInitInfo()
      if (initInfo?.init_template) {
        creatingFromTemplate = true
        createAppFromTemplateUrl(initInfo.init_template)
        return
      }
    } catch (error) {
      notifications.error("Error loading apps and templates")
    }
    loaded = true
  })
</script>

<Page wide>
  <Layout noPadding gap="XL">
    {#if loaded}
      <div class="title">
        <div class="welcome">
          <Layout noPadding gap="XS">
            <Heading size="L">{welcomeHeader}</Heading>
            <Body size="M">
              {welcomeBody}
            </Body>
          </Layout>

          <div class="buttons">
            <Button
              dataCy="create-app-btn"
              size="M"
              icon="Add"
              cta
              on:click={initiateAppCreation}
            >
              {createAppButtonText}
            </Button>
            {#if $apps?.length > 0}
              <Button
                icon="Experience"
                size="M"
                quiet
                secondary
                on:click={$goto("/builder/portal/apps/templates")}
              >
                Templates
              </Button>
            {/if}
            {#if !$apps?.length}
              <Button
                dataCy="import-app-btn"
                icon="Import"
                size="L"
                quiet
                secondary
                on:click={initiateAppImport}
              >
                Import app
              </Button>
            {/if}
          </div>
        </div>
        <div>
          <Layout gap="S" justifyItems="center">
            <img class="img-logo img-size" alt="logo" src={Logo} />
          </Layout>
        </div>
        <Divider size="S" />
      </div>

      {#if !$apps?.length && $templates?.length}
        <TemplateDisplay templates={$templates} />
      {/if}

      {#if enrichedApps.length}
        <Layout noPadding gap="S">
          <div class="title">
            <Detail size="L">Apps</Detail>
            {#if enrichedApps.length > 1}
              <div class="app-actions">
                {#if cloud}
                  <Button
                    size="M"
                    icon="Export"
                    quiet
                    secondary
                    on:click={initiateAppsExport}
                  >
                    Export apps
                  </Button>
                {/if}
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
            {/if}
          </div>

          <div class="appTable">
            {#each filteredApps as app (app.appId)}
              <AppRow
                {copyAppId}
                {releaseLock}
                {editIcon}
                {app}
                {unpublishApp}
                {viewApp}
                {editApp}
                {exportApp}
                {deleteApp}
                {updateApp}
                {previewApp}
              />
            {/each}
          </div>
        </Layout>
      {/if}
    {/if}

    {#if creatingFromTemplate}
      <div class="empty-wrapper">
        <img class="img-logo img-size" alt="logo" src={Logo} />
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

<Modal bind:this={updatingModal} padding={false} width="600px">
  <UpdateAppModal app={selectedApp} />
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
  dataCy={"unpublish-modal"}
>
  Are you sure you want to unpublish the app <b>{selectedApp?.name}</b>?
</ConfirmDialog>

<ChooseIconModal app={selectedApp} bind:this={iconModal} />

<style>
  .app-actions {
    display: flex;
  }
  .app-actions :global(> button) {
    margin-right: 10px;
  }
  .title .welcome > .buttons {
    padding-top: 30px;
  }
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
  @media (max-width: 1000px) {
    .img-logo {
      display: none;
    }
  }
  .filter {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: var(--spacing-xl);
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
  .img-size {
    width: 160px;
    height: 160px;
  }
</style>
