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
    environment,
    enrichedApps,
    sortBy,
  } from "@/stores/portal"
  import { goto } from "@roxi/routify"
  import AppRow from "@/components/start/AppRow.svelte"
  import Logo from "assets/bb-space-man.svg"

  let template
  let creationModal
  let appLimitModal
  let accountLockedModal
  let searchTerm = ""
  let creatingFromTemplate = false
  let automationErrors

  $: welcomeHeader = `Welcome ${$auth?.user?.firstName || "back"}`
  $: filteredApps = filterApps($enrichedApps, searchTerm)
  $: automationErrors = getAutomationErrors(filteredApps || [])
  $: isOwner = $auth.accountPortalAccess && $admin.cloud

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
    const params = new URLSearchParams({
      open: "error",
    })
    $goto(`/builder/app/${appId}/settings/automations?${params.toString()}`)
  }

  const errorCount = errors => {
    return Object.values(errors).reduce((acc, next) => acc + next.length, 0)
  }

  const automationErrorMessage = appId => {
    const app = $enrichedApps.find(app => app.devId === appId)
    const errors = automationErrors[appId]
    return `${app.name} - Automation error (${errorCount(errors)})`
  }

  const initiateAppCreation = async () => {
    if ($licensing?.usageMetrics?.apps >= 100) {
      appLimitModal.show()
    } else if ($appsStore.apps?.length) {
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
      const appsWithSameName = $appsStore.apps.filter(app =>
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
      await initialise(pkg)

      // Update checklist - in case first app
      await admin.init()

      // Create user
      await API.updateOwnMetadata({
        roleId: "BASIC",
      })
      await auth.setInitInfo({})
      $goto(`/builder/app/${createdApp.instance._id}`)
    } catch (error) {
      notifications.error(`Error creating app - ${error.message}`)
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
                Create new app
              </Button>
              {#if $appsStore.apps?.length > 0 && !$admin.offlineMode}
                <Button
                  size="M"
                  secondary
                  on:click={usersLimitLockAction ||
                    $goto("/builder/portal/apps/templates")}
                >
                  View templates
                </Button>
              {/if}
              {#if !$appsStore.apps?.length}
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
          {#if $appsStore.apps.length > 1}
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
