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
  import Spinner from "components/common/Spinner.svelte"
  import CreateAppModal from "components/start/CreateAppModal.svelte"
  import AppLimitModal from "components/portal/licensing/AppLimitModal.svelte"
  import AccountLockedModal from "components/portal/licensing/AccountLockedModal.svelte"
  import { sdk } from "@budibase/shared-core"

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
  let accountLockedModal
  let searchTerm = ""
  let creatingFromTemplate = false
  let automationErrors
  let accessFilterList = null

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
  $: isOwner = $auth.accountPortalAccess && $admin.cloud

  const usersLimitLockAction = $licensing?.errUserLimit
    ? () => accountLockedModal.show()
    : null

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
    $goto(
      `/builder/app/${appId}/settings/automation-history?${params.toString()}`
    )
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
    }
  }

  const initiateAppImport = () => {
    template = { fromFile: true }
    creationModal.show()
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
      if (usersLimitLockAction) {
        usersLimitLockAction()
      }
    } catch (error) {
      notifications.error("Error getting init info")
    }
  })
</script>

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
            Below you'll find the list of apps that you have access to
          </Body>
        </Layout>
      </div>
    </div>

    {#if enrichedApps.length}
      <Layout noPadding gap="L">
        <div class="title">
          {#if $auth.user && sdk.users.isGlobalBuilder($auth.user)}
            <div class="buttons">
              <Button
                size="M"
                cta
                on:click={usersLimitLockAction || initiateAppCreation}
              >
                Create new app
              </Button>
              {#if $apps?.length > 0 && !$admin.offlineMode}
                <Button
                  size="M"
                  secondary
                  on:click={usersLimitLockAction ||
                    $goto("/builder/portal/apps/templates")}
                >
                  View templates
                </Button>
              {/if}
              {#if !$apps?.length}
                <Button
                  size="L"
                  quiet
                  secondary
                  on:click={usersLimitLockAction || initiateAppImport}
                >
                  Import app
                </Button>
              {/if}
            </div>
          {/if}
          {#if enrichedApps.length > 1}
            <div class="app-actions">
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
  <CreateAppModal {template} />
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
    gap: var(--spacing-xl);
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
    .app-actions :global(> .spectrum-Icon) {
      display: none;
    }
    .app-actions > :global(*) {
      flex: 1 1 auto;
    }
  }
</style>
