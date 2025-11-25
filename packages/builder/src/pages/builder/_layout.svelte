<script>
  import { isActive, redirect, goto } from "@roxi/routify"
  import {
    admin,
    auth,
    licensing,
    navigation,
    appsStore,
    organisation,
    groups,
    enrichedApps,
  } from "@/stores/portal"
  import { sdk } from "@budibase/shared-core"
  import { bb } from "@/stores/bb"
  import { onMount } from "svelte"
  import {
    CookieUtils,
    Constants,
    popNumSessionsInvalidated,
    invalidationMessage,
    derivedMemo,
  } from "@budibase/frontend-core"
  import { API } from "@/api"
  import Branding from "./Branding.svelte"
  import ContextMenu from "@/components/ContextMenu.svelte"
  import CommandPalette from "@/components/commandPalette/CommandPalette.svelte"
  import {
    Modal,
    notifications,
    Layout,
    Heading,
    Body,
    Button,
  } from "@budibase/bbui"
  import SettingsModal from "@/components/settings/SettingsModal.svelte"
  import AccountLockedModal from "@/components/portal/licensing/AccountLockedModal.svelte"
  import EnterpriseBasicTrialBanner from "@/components/portal/licensing/EnterpriseBasicTrialBanner.svelte"
  import { writable } from "svelte/store"

  let initPromise
  let loaded = writable(false)
  let commandPaletteModal
  let settingsModal
  let accountLockedModal
  let hasAuthenticated = false
  let lastExecutedAction = null

  $: multiTenancyEnabled = $admin.multiTenancy
  $: hasAdminUser = $admin?.checklist?.adminUser?.checked
  $: cloud = $admin?.cloud
  $: user = $auth.user
  $: isOwner = $auth.accountPortalAccess && $admin.cloud
  $: useAccountPortal = cloud && !$admin.disableAccountPortal
  $: isBuilder = sdk.users.hasBuilderPermissions(user)
  // Re-run initBuilder when user logs in
  $: {
    const isAuthenticated = !!$auth.user
    if (isAuthenticated && !hasAuthenticated) {
      initPromise = initBuilder()
    }
    hasAuthenticated = isAuthenticated
  }

  $: lockAction =
    $licensing?.errUserLimit || $auth?.user?.lockedBy
      ? accountLockedModal.show
      : null

  $: updateBannerVisibility($auth.user, $licensing.license?.plan?.type, isOwner)

  $: processNavAction($navigationAction)

  navigation.init($redirect)

  const isOnPreLoginPage = () => {
    return $isActive("./auth") || $isActive("./invite") || $isActive("./admin")
  }

  // Determine if the user is on a trial and show the banner.
  const updateBannerVisibility = (user, licenseType, isOwner) => {
    if (!user && $licensing.showTrialBanner) {
      licensing.update(store => {
        store.showTrialBanner = false
        return store
      })
    } else if (
      user &&
      !$licensing.showTrialBanner &&
      licenseType === Constants.PlanType.ENTERPRISE_BASIC_TRIAL &&
      isOwner
    ) {
      licensing.update(store => {
        store.showTrialBanner = true
        return store
      })
    }
  }

  // Handle navigation actions from derived store
  const processNavAction = action => {
    // Reset last executed action when there's no action to process
    if (!action) {
      lastExecutedAction = null
      return
    }

    // Prevent executing the same action repeatedly
    const actionKey = JSON.stringify(action)
    if (actionKey === lastExecutedAction) {
      return
    }
    lastExecutedAction = actionKey

    switch (action.type) {
      case "setReturnUrl":
        CookieUtils.setCookie(Constants.Cookies.ReturnUrl, action.url)
        break

      case "redirect":
        if (!$isActive(action.path)) {
          $redirect(action.path)
        }
        break

      case "returnUrl":
        CookieUtils.removeCookie(Constants.Cookies.ReturnUrl)
        $goto(action.url)
        break
    }
  }

  const navigationAction = derivedMemo(
    [admin, auth, enrichedApps, isActive, appsStore, loaded],
    ([$admin, $auth, $enrichedApps, $isActive, $appsStore, $loaded]) => {
      // Only run remaining logic when fully loaded
      if (!$loaded || !$admin.loaded || !$auth.loaded) {
        return null
      }

      // Set the return url on logout
      if (
        !$auth.user &&
        !CookieUtils.getCookie(Constants.Cookies.ReturnUrl) &&
        !$auth.postLogout &&
        !isOnPreLoginPage()
      ) {
        return { type: "setReturnUrl", url: window.location.pathname }
      }

      // if tenant is not set go to it
      if (!useAccountPortal && multiTenancyEnabled && !$auth.tenantSet) {
        return { type: "redirect", path: "./auth/org" }
      }

      // Force creation of an admin user if one doesn't exist
      if (!useAccountPortal && !hasAdminUser) {
        return { type: "redirect", path: "./admin" }
      }

      // Redirect to log in at any time if the user isn't authenticated
      if (!$auth.user && !isOnPreLoginPage()) {
        return { type: "redirect", path: "./auth" }
      }

      // Check if password reset required for user
      if ($auth.user?.forceResetPassword) {
        return { type: "redirect", path: "./auth/reset" }
      }

      // Authenticated user navigation
      if ($auth.user) {
        const returnUrl = CookieUtils.getCookie(Constants.Cookies.ReturnUrl)

        // Return to saved URL first - skip onboarding check if user has a return URL
        if (returnUrl) {
          return { type: "returnUrl", url: returnUrl }
        }

        // Review if builder users have workspaces. If not, redirect them to get-started
        const hasEditableWorkspaces = $enrichedApps.some(app => app.editable)
        if (
          ($appsStore.apps.length === 0 ||
            (isBuilder && !hasEditableWorkspaces)) &&
          !$isActive("./apps") &&
          !$isActive("./onboarding") &&
          !$isActive("./get-started")
        ) {
          // Tenant owners without apps should be redirected to onboarding
          if (isOwner) {
            return { type: "redirect", path: "./onboarding" }
          }
          // Regular builders without apps should be redirected to "get started"
          if (isBuilder && !isOwner) {
            return { type: "redirect", path: "./get-started" }
          }
        }

        // Redirect non-builders to apps unless they're already there
        if (!isBuilder && !$isActive("./apps")) {
          return { type: "redirect", path: "./apps" }
        }

        // Default workspace selection for builders
        const isOnWorkspaceRoute =
          $isActive("./workspace/:application") ||
          $isActive("./workspace/updating/:application")
        if (
          isBuilder &&
          $appsStore.apps.length &&
          !isOnWorkspaceRoute &&
          !$isActive("./apps")
        ) {
          // Find first editable app to redirect to
          const defaultApp = $enrichedApps.find(app => app.editable)
          // Only redirect if enriched apps are loaded and app is editable
          if (defaultApp?.devId) {
            return { type: "redirect", path: `./workspace/${defaultApp.devId}` }
          }
        }
      }

      return null
    }
  )

  async function analyticsPing() {
    await API.analyticsPing({ source: "builder" })
  }

  async function initBuilder() {
    loaded.set(false)
    try {
      await auth.getSelf()
      await admin.init()

      if ($admin.maintenance.length > 0) {
        $redirect("./maintenance")
        return
      }
      if ($auth.user) {
        // We need to load apps to know if we need to show onboarding fullscreen
        await Promise.all([
          licensing.init(),
          appsStore.load(),
          organisation.init(),
          groups.init(),
        ])

        await auth.getInitInfo()

        if (lockAction) {
          lockAction()
        }
      }

      // Validate tenant if in a multi-tenant env
      if (multiTenancyEnabled) {
        await auth.validateTenantId()
      }
    } catch (error) {
      // Don't show a notification here, as we might 403 initially due to not
      // being logged in. API error handler will clear user if session was destroyed.
      console.error("Error during builder initialization:", error)
      // Rethrow to trigger catch block in template
      throw error
    }

    loaded.set(true)

    const invalidated = popNumSessionsInvalidated()
    if (invalidated > 0) {
      notifications.info(invalidationMessage(invalidated), {
        duration: 5000,
      })
    }
    try {
      await analyticsPing()
    } catch (e) {
      console.error("Analytics ping failed", e?.message)
    }
  }

  // Event handler for the command palette
  const handleKeyDown = e => {
    if (e.key === "k" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      commandPaletteModal.toggle()
    }
  }

  onMount(() => {
    initPromise = initBuilder()
    hasAuthenticated = !!$auth.user
  })
</script>

<EnterpriseBasicTrialBanner show={$licensing.showTrialBanner} />

<AccountLockedModal
  bind:this={accountLockedModal}
  lockedBy={$auth.user?.lockedBy}
  onConfirm={() =>
    isOwner ? licensing.goToUpgradePage() : licensing.goToPricingPage()}
/>

<!-- Global settings modal -->
<SettingsModal bind:this={settingsModal} on:hide={() => bb.hideSettings()} />

<!-- Portal branding overrides -->
<Branding />
<ContextMenu />

<svelte:window on:keydown={handleKeyDown} />
<Modal bind:this={commandPaletteModal} zIndex={999999}>
  <CommandPalette />
</Modal>

{#await initPromise}
  <div class="loading" />
{:then _}
  {#if $loaded || $admin.maintenance.length}
    <div class="content">
      <slot />
    </div>
  {/if}
{:catch error}
  <div class="init page-error">
    <Layout gap={"S"} alignContent={"center"} justifyItems={"center"}>
      <Heading size={"L"}>Oops...</Heading>
      <Body size={"S"}>There was a problem initialising the builder</Body>
      {#if error?.message}
        <div class="error-message">
          {error.message}
        </div>
      {/if}
      <Button
        secondary
        on:click={() => {
          $goto("/")
        }}
      >
        Reload
      </Button>
    </Layout>
  </div>
{/await}

<style>
  .init.page-error,
  .init.page-error :global(.container) {
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
  .error-message {
    padding: var(--spacing-m);
    border-radius: 4px;
    background-color: var(--spectrum-global-color-gray-50);
    font-family: monospace;
    font-size: 12px;
    max-width: 90%;
    word-break: break-all;
  }
  .loading {
    min-height: 100vh;
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .content {
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    height: 100%;
    overflow: hidden;
  }
</style>
