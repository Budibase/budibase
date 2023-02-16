<script>
  import {
    Heading,
    Layout,
    Button,
    Select,
    Modal,
    Page,
    notifications,
    Notification,
    Body,
    Icon,
    Search,
    InlineAlert,
  } from "@budibase/bbui"
  import Spinner from "components/common/Spinner.svelte"
  import CreateAppModal from "components/start/CreateAppModal.svelte"
  import AppLimitModal from "components/portal/licensing/AppLimitModal.svelte"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"

  import { store, automationStore } from "builderStore"
  import { API } from "api"
  import { onMount } from "svelte"
  import { apps, auth, admin, licensing, environment } from "stores/portal"
  import { goto } from "@roxi/routify"
  import AppRow from "components/start/AppRow.svelte"
  import { AppStatus } from "constants"
  import Logo from "assets/bb-space-man.svg"

  let sortBy = "name"
  let template
  let creationModal
  let appLimitModal
  let creatingApp = false
  let searchTerm = ""
  let cloud = $admin.cloud
  let creatingFromTemplate = false
  let automationErrors
  let accessFilterList = null
  let confirmDownloadDialog

  $: welcomeHeader = `Welcome ${$auth?.user?.firstName || "back"}`
  $: enrichedApps = enrichApps($apps, $auth.user, sortBy)
  $: filteredApps = enrichedApps.filter(
    app =>
      (searchTerm
        ? app?.name?.toLowerCase().includes(searchTerm.toLowerCase())
        : true) &&
      (accessFilterList !== null
        ? accessFilterList?.includes(
            `${app?.type}_${app?.tenantId}_${app?.appId}`
          )
        : true)
  )
  $: automationErrors = getAutomationErrors(enrichedApps)

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

  const getAutomationErrors = apps => {
    const automationErrors = {}
    for (let app of apps) {
      if (app.automationErrors) {
        if (errorCount(app.automationErrors) > 0) {
          automationErrors[app.devId] = app.automationErrors
        }
      }
    }
    return automationErrors
  }

  const goToAutomationError = appId => {
    const params = new URLSearchParams({
      open: "error",
    })
    $goto(`../overview/${appId}/automation-history?${params.toString()}`)
  }

  const errorCount = errors => {
    return Object.values(errors).reduce((acc, next) => acc + next.length, 0)
  }

  const automationErrorMessage = appId => {
    const app = enrichedApps.find(app => app.devId === appId)
    const errors = automationErrors[appId]
    return `${app.name} - Automation error (${errorCount(errors)})`
  }

  const initiateAppCreation = async () => {
    if ($licensing?.usageMetrics?.apps >= 100) {
      appLimitModal.show()
    } else if ($apps?.length) {
      $goto("/builder/portal/apps/create")
    } else {
      template = null
      creationModal.show()
      creatingApp = true
    }
  }

  const initiateAppsExport = () => {
    try {
      window.location = `/api/cloud/export`
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
      const templateKey = template.key.split("/")[1]

      let appName = templateKey.replace(/-/g, " ")
      const appsWithSameName = $apps.filter(app =>
        app.name?.startsWith(appName)
      )
      appName = `${appName} ${appsWithSameName.length + 1}`

      // Create form data to create app
      let data = new FormData()
      data.append("name", appName)
      data.append("useTemplate", true)
      data.append("templateKey", template.key)

      // Create App
      const createdApp = await API.createApp(data)

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
      await environment.loadVariables()
      // If the portal is loaded from an external URL with a template param
      const initInfo = await auth.getInitInfo()
      if (initInfo?.init_template) {
        creatingFromTemplate = true
        createAppFromTemplateUrl(initInfo.init_template)
      }
    } catch (error) {
      notifications.error("Error getting init info")
    }
  })
</script>

{#if $apps.length}
  <Page>
    <Layout noPadding gap="L">
      {#each Object.keys(automationErrors || {}) as appId}
        <Notification
          wide
          dismissable
          action={() => goToAutomationError(appId)}
          type="error"
          icon="Alert"
          actionMessage={errorCount(automationErrors[appId]) > 1
            ? "View errors"
            : "View error"}
          on:dismiss={async () => {
            await automationStore.actions.clearLogErrors({ appId })
            await apps.load()
          }}
          message={automationErrorMessage(appId)}
        />
      {/each}
      <div class="title">
        <div class="welcome">
          <Layout noPadding gap="XS">
            <Heading size="L">{welcomeHeader}</Heading>
            <Body size="M">
              Manage your apps and get a head start with templates
            </Body>
          </Layout>
        </div>
      </div>

      {#if enrichedApps.length}
        <Layout noPadding gap="L">
          <div class="title">
            <div class="buttons">
              <Button size="M" cta on:click={initiateAppCreation}>
                Create new app
              </Button>
              {#if $apps?.length > 0}
                <Button
                  size="M"
                  secondary
                  on:click={$goto("/builder/portal/apps/templates")}
                >
                  View templates
                </Button>
              {/if}
              {#if !$apps?.length}
                <Button size="L" quiet secondary on:click={initiateAppImport}>
                  Import app
                </Button>
              {/if}
            </div>
            {#if enrichedApps.length > 1}
              <div class="app-actions">
                {#if cloud}
                  <Icon
                    name="Download"
                    hoverable
                    on:click={confirmDownloadDialog.show}
                  />
                {/if}
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
                <Search placeholder="Search" bind:value={searchTerm} />
              </div>
            {/if}
          </div>

          <div class="app-table">
            {#each filteredApps as app (app.appId)}
              <AppRow {app} />
            {/each}
          </div>
        </Layout>
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
{/if}

<Modal
  bind:this={creationModal}
  padding={false}
  width="600px"
  on:hide={stopAppCreation}
>
  <CreateAppModal {template} />
</Modal>

<AppLimitModal bind:this={appLimitModal} />

<ConfirmDialog
  bind:this={confirmDownloadDialog}
  okText="Continue"
  onOk={initiateAppsExport}
  warning={false}
  title="Download all apps"
>
  <InlineAlert
    header="Do not share your budibase application exports publicly as they may contain sensitive information such as database credentials or secret keys."
  />
</ConfirmDialog>

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
  .app-actions {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: var(--spacing-xl);
    flex-wrap: wrap;
  }
  .app-actions :global(.spectrum-Textfield) {
    max-width: 180px;
  }

  .app-table {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: var(--spacing-xl);
    overflow: hidden;
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

  @media (max-width: 1000px) {
    .img-logo {
      display: none;
    }
  }
  @media (max-width: 640px) {
    .app-actions {
      margin-top: var(--spacing-xl);
      margin-bottom: calc(-1 * var(--spacing-m));
    }
    .app-actions :global(.spectrum-Textfield) {
      max-width: none;
    }
    /*  Hide download apps icon */
    .app-actions :global(> .spectrum-Icon) {
      display: none;
    }
    .app-actions > :global(*) {
      flex: 1 1 auto;
    }
  }
</style>
