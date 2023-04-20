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

  import { _ } from "../../../../../lang/i18n"

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

  $: welcomeHeader = `${$_("pages.builder.portal.apps.index.Welcome")} ${
    $auth?.user?.firstName || $_("pages.builder.portal.apps.index.back")
  }`
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
    return `${app.name} - ${$_(
      "pages.builder.portal.apps.index.Automation_error"
    )} (${errorCount(errors)})`
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
      notifications.success(
        $_("pages.builder.portal.apps.index.Apps_exported_successfully")
      )
    } catch (err) {
      notifications.error(
        `${$_("pages.builder.portal.apps.index.Error_exporting_apps")}: ${err}`
      )
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
      notifications.error($_("pages.builder.portal.apps.index.Error_creating"))
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
      notifications.error($_("pages.builder.portal.apps.index.URL_invalid"))
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
      notifications.error($_("pages.builder.portal.apps.index.Error_info"))
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
            ? $_("pages.builder.portal.apps.index.View_errors")
            : $_("pages.builder.portal.apps.index.View_error")}
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
              {$_("pages.builder.portal.apps.index.Manage_apps")}
            </Body>
          </Layout>
        </div>
      </div>

      {#if enrichedApps.length}
        <Layout noPadding gap="L">
          <div class="title">
            <div class="buttons">
              <Button size="M" cta on:click={initiateAppCreation}>
                {$_("pages.builder.portal.apps.index.Create_app")}
              </Button>
              {#if $apps?.length > 0}
                <Button
                  size="M"
                  secondary
                  on:click={$goto("/builder/portal/apps/templates")}
                >
                  {$_("pages.builder.portal.apps.index.View_templates")}
                </Button>
              {/if}
              {#if !$apps?.length}
                <Button size="L" quiet secondary on:click={initiateAppImport}>
                  {$_("pages.builder.portal.apps.index.Import_app")}
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
                    {
                      label: $_("pages.builder.portal.apps.index.Sort_name"),
                      value: "name",
                    },
                    {
                      label: $_("pages.builder.portal.apps.index.Sort_updated"),
                      value: "updated",
                    },
                    {
                      label: $_("pages.builder.portal.apps.index.Sort_status"),
                      value: "status",
                    },
                  ]}
                />
                <Search
                  placeholder={$_("pages.builder.portal.apps.index.Search")}
                  bind:value={searchTerm}
                />
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
          <p>{$_("pages.builder.portal.apps.index.Creating_Budibase")}</p>
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
  okText={$_("pages.builder.portal.apps.index.Continue")}
  onOk={initiateAppsExport}
  warning={false}
  title={$_("pages.builder.portal.apps.index.Download_apps")}
>
  <InlineAlert header={$_("pages.builder.portal.apps.index.Do_not_share")} />
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
