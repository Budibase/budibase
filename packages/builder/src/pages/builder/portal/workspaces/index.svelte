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
    Search,
  } from "@budibase/bbui"
  import Spinner from "@/components/common/Spinner.svelte"
  import CreateAppModal from "@/components/start/CreateAppModal.svelte"
  import AppLimitModal from "@/components/portal/licensing/AppLimitModal.svelte"
  import AccountLockedModal from "@/components/portal/licensing/AccountLockedModal.svelte"
  import { sdk } from "@budibase/shared-core"
  import { automationStore, initialise } from "@/stores/builder"
  import { API } from "@/api"
  import { onMount } from "svelte"
  import {
    appsStore,
    auth,
    admin,
    licensing,
    enrichedApps,
    sortBy,
    templates,
    appCreationStore,
    backups,
  } from "@/stores/portal"
  import { goto } from "@roxi/routify"
  import AppRow from "@/components/start/AppRow.svelte"
  import Logo from "assets/bb-space-man.svg"
  import TemplatesModal from "@/components/start/TemplatesModal.svelte"
  import HeroBanner from "@/components/common/HeroBanner.svelte"
  import { BannerType } from "@/constants/banners"

  let creationModal
  let appLimitModal
  let accountLockedModal
  let templatesModal
  let searchTerm = ""
  let creatingFromTemplate = false
  let automationErrors
  let backupErrors

  $: welcomeHeader = `Welcome ${$auth?.user?.firstName || "back"}`
  $: filteredApps = filterApps($enrichedApps, searchTerm)
  $: automationErrors = getAutomationErrors(filteredApps || [])
  $: backupErrors = getBackupErrors(filteredApps || [])
  $: isOwner = $auth.accountPortalAccess && $admin.cloud

  $: if (
    ($appCreationStore.showCreateModal || $appCreationStore.showImportModal) &&
    creationModal
  ) {
    creationModal.show()
  }

  $: if ($appCreationStore.showTemplatesModal && templatesModal) {
    templatesModal.show()
  }

  const filterApps = (apps, searchTerm) => {
    return apps?.filter(app => {
      const query = searchTerm?.trim()?.replace(/\s/g, "")
      if (query) {
        return app?.name?.toLowerCase().includes(query.toLowerCase())
      } else {
        return true
      }
    })
  }

  const usersLimitLockAction = $licensing?.errUserLimit
    ? () => accountLockedModal.show()
    : null

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
    const automationId = Object.keys(automationErrors[appId] || {})[0]
    if (automationId) {
      $goto(`/builder/workspace/${appId}/automation/${automationId}`)
    }
  }

  const errorCount = errors => {
    return Object.values(errors).reduce((acc, next) => acc + next.length, 0)
  }

  const automationErrorMessage = appId => {
    const app = $enrichedApps.find(app => app.devId === appId)
    const errors = automationErrors[appId]
    return `${app.name} - Automation error (${errorCount(errors)})`
  }

  const getBackupErrors = apps => {
    const backupErrors = {}
    for (const app of apps) {
      if (app.backupErrors && errorCount(app.backupErrors) > 0) {
        backupErrors[app.devId] = app.backupErrors
      }
    }
    return backupErrors
  }

  const goToBackupError = appId => {
    const backupId = Object.keys(backupErrors[appId] || {})[0]
    if (backupId) {
      // For now, just navigate to the app's backup page or show details
      // Could be enhanced to show specific backup error details
      $goto(`/builder/workspace/${appId}/settings/backups`)
    }
  }

  const backupErrorMessage = appId => {
    const app = $enrichedApps.find(app => app.devId === appId)
    const errors = backupErrors[appId]
    return `${app.name} - Backup error (${errorCount(errors)})`
  }

  const initiateAppCreation = async () => {
    if ($licensing?.usageMetrics?.apps >= 100) {
      appLimitModal.show()
    } else {
      appCreationStore.showCreateModal()
    }
  }

  const initiateAppImport = () => {
    if ($licensing?.usageMetrics?.apps >= 100) {
      appLimitModal.show()
    } else {
      appCreationStore.showImportModal()
    }
  }

  const autoCreateApp = async () => {
    try {
      const template = $appCreationStore.template
      if (!template?.key) {
        notifications.error("No template selected")
        return
      }

      const toTitleCase = str => {
        return str.replace(
          /\w\S*/g,
          txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        )
      }

      // Auto name app if has same name
      const templateKey = template.key.split("/")[1]

      let baseName = templateKey.replace(/-/g, " ")
      baseName = toTitleCase(baseName)

      // generate a unique app name and url
      const baseUrl = baseName.toLowerCase().replace(/\s+/g, "-")

      const isNameTaken = name => $appsStore.apps.some(app => app.name === name)
      const isUrlTaken = url =>
        $appsStore.apps.some(app => app.url?.replace(/^\//, "") === url)

      let counter = 1
      let appName = baseName
      let appUrl = baseUrl

      while (isNameTaken(appName) || isUrlTaken(appUrl)) {
        counter++
        appName = `${baseName} ${counter}`
        appUrl = `${baseUrl}-${counter}`
      }

      // Create form data to create app
      let data = new FormData()
      data.append("name", appName)
      data.append("url", appUrl)
      data.append("useTemplate", "true")
      data.append("templateKey", template.key)
      data.append("isOnboarding", "false")

      // Create App
      const createdApp = await API.createApp(data)

      // Select Correct Application/DB in prep for creating user
      const pkg = await API.fetchAppPackage(createdApp.instance._id)
      await initialise(pkg)

      // Update checklist - in case first app
      await admin.init()

      // Create user
      await API.updateOwnMetadata({
        roleId: "BASIC",
      })
      await auth.setInitInfo({})
      $goto(`/builder/workspace/${createdApp.instance._id}`)
    } catch (error) {
      notifications.error(`Error creating app - ${error.message}`)
    }
  }

  const stopAppCreation = () => {
    appCreationStore.hideCreateModal()
    appCreationStore.hideImportModal()
    appCreationStore.hideTemplatesModal()
    appCreationStore.clearTemplate()
  }

  function createAppFromTemplateUrl(templateKey) {
    // validate the template key just to make sure
    const templateParts = templateKey.split("/")
    if (templateParts.length === 2 && templateParts[0] === "app") {
      if ($licensing?.usageMetrics?.apps >= 100) {
        appLimitModal.show()
        return
      }
      appCreationStore.setTemplate({ key: templateKey })
      autoCreateApp()
    } else {
      notifications.error("Your Template URL is invalid. Please try another.")
    }
  }

  const handleTemplateSelect = selectedTemplate => {
    if ($licensing?.usageMetrics?.apps >= 100) {
      appLimitModal.show()
      return
    }
    appCreationStore.setTemplate(selectedTemplate)
    appCreationStore.hideTemplatesModal()
    autoCreateApp()
  }

  onMount(async () => {
    try {
      // If the portal is loaded from an external URL with a template param
      const initInfo = await auth.getInitInfo()
      if (initInfo?.init_template) {
        creatingFromTemplate = true
        createAppFromTemplateUrl(initInfo.init_template)
      }
      if (usersLimitLockAction) {
        usersLimitLockAction()
      }
      await templates.load()
    } catch (error) {
      notifications.error("Error getting init info")
    }
  })
</script>

<HeroBanner
  title="Workspaces are live"
  linkTitle="Learn about workspaces"
  linkHref="https://budibase.com/blog/updates/workspaces/"
  color="var(--spectrum-global-color-gray-100)"
  image="https://res.cloudinary.com/daog6scxm/image/upload/w_1200,h_800/v1628152378/1.%20Illustrations/Scene_4_web_version_izudxc.avif"
  key={BannerType.PORTAL}
>
  Previously, Budibase centered everything around building a single app. With
  Workspaces, that changes. Now, you can group multiple apps, automations, and
  data sources together within a single workspace. Existing apps now have their
  own workspace.
</HeroBanner>
<Page>
  <Layout noPadding gap="L">
    {#each Object.keys(automationErrors || {}) as appId}
      <Notification
        wide
        dismissable
        action={() => goToAutomationError(appId)}
        type="error"
        icon="warning"
        actionMessage={errorCount(automationErrors[appId]) > 1
          ? "View errors"
          : "View error"}
        on:dismiss={async () => {
          const automationId = Object.keys(automationErrors[appId] || {})[0]
          if (automationId) {
            await automationStore.actions.clearLogErrors({
              appId,
              automationId,
            })
            await appsStore.load()
          }
        }}
        message={automationErrorMessage(appId)}
      />
    {/each}
    {#each Object.keys(backupErrors || {}) as appId}
      <Notification
        wide
        dismissable
        action={() => goToBackupError(appId)}
        type="error"
        icon="warning"
        actionMessage={errorCount(backupErrors[appId]) > 1
          ? "View errors"
          : "View error"}
        on:dismiss={async () => {
          const backupId = Object.keys(backupErrors[appId] || {})[0]
          if (backupId) {
            await backups.clearBackupErrors(appId)
            await appsStore.load()
          }
        }}
        message={backupErrorMessage(appId)}
      />
    {/each}
    <div class="title">
      <div class="welcome">
        <Layout noPadding gap="XS">
          <Heading size="M">{welcomeHeader}</Heading>
          <Body size="M">
            Below you'll find the list of workspaces that you have access to
          </Body>
        </Layout>
      </div>
    </div>

    {#if $appsStore.apps.length}
      <Layout noPadding gap="L">
        <div class="title">
          {#if $auth.user && sdk.users.canCreateApps($auth.user)}
            <div class="buttons">
              <Button
                size="M"
                cta
                on:click={usersLimitLockAction || initiateAppCreation}
              >
                Create new workspace
              </Button>

              {#if $appsStore.apps?.length > 0}
                {#if !$admin.offlineMode}
                  <Button
                    size="M"
                    secondary
                    on:click={usersLimitLockAction || templatesModal.show}
                  >
                    View templates
                  </Button>
                {/if}
                <Button
                  size="M"
                  secondary
                  on:click={usersLimitLockAction || initiateAppImport}
                >
                  Import workspace
                </Button>
              {/if}
            </div>
          {/if}
          <div class="app-actions">
            <Select
              autoWidth
              value={$sortBy}
              on:change={e => {
                appsStore.updateSort(e.detail)
              }}
              placeholder={null}
              options={[
                { label: "Sort by name", value: "name" },
                { label: "Sort by recently updated", value: "updated" },
                { label: "Sort by status", value: "status" },
              ]}
            />
            <Search
              placeholder="Search"
              on:input={e => {
                searchTerm = e.target.value
              }}
              on:change={e => {
                if (!e.detail) {
                  searchTerm = null
                }
              }}
            />
          </div>
        </div>

        <div class="app-table">
          {#each filteredApps as app (app.appId)}
            <AppRow {app} lockedAction={usersLimitLockAction} />
          {/each}
        </div>
      </Layout>
    {:else}
      <div class="no-apps">
        <img class="spaceman" alt="spaceman" src={Logo} width="100px" />
        <Body weight="700">You haven't been given access to any apps yet</Body>
      </div>
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
  <CreateAppModal
    key={$appCreationStore.showImportModal
      ? "import"
      : $appCreationStore.showCreateModal
        ? "create"
        : "none"}
  />
</Modal>

<Modal bind:this={templatesModal}>
  <TemplatesModal onSelectTemplate={handleTemplateSelect} />
</Modal>

<AppLimitModal bind:this={appLimitModal} />
<AccountLockedModal
  bind:this={accountLockedModal}
  onConfirm={() =>
    isOwner ? $licensing.goToUpgradePage() : $licensing.goToPricingPage()}
/>

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
    gap: var(--spacing-l);
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

  .no-apps {
    background-color: var(--spectrum-global-color-gray-100);
    padding: calc(var(--spacing-xl) * 2);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: var(--spacing-xl);
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
    .app-actions :global(> i) {
      display: none;
    }
    .app-actions > :global(*) {
      flex: 1 1 auto;
    }
  }
</style>
