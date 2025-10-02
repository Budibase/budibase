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
  import { appStore } from "@/stores/builder"
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
  let isAuthenticated = undefined

  $: multiTenancyEnabled = $admin.multiTenancy
  $: hasAdminUser = $admin?.checklist?.adminUser?.checked
  $: baseUrl = $admin?.baseUrl
  $: cloud = $admin?.cloud
  $: user = $auth.user
  $: isOwner = $auth.accountPortalAccess && $admin.cloud
  $: useAccountPortal = cloud && !$admin.disableAccountPortal
  $: isBuilder = sdk.users.hasBuilderPermissions(user)

  $: usersLimitLockAction = $licensing?.errUserLimit
    ? () => accountLockedModal.show()
    : null

  navigation.init($redirect)

  // Only recalculates when an action actually changes
  const navigationAction = derivedMemo(
    [admin, auth, enrichedApps, appStore, isActive, appsStore, loaded],
    ([
      $admin,
      $auth,
      $enrichedApps,
      $appStore,
      $isActive,
      $appsStore,
      $loaded,
    ]) => {
      // Only run logic when fully loaded
      if (!$loaded || !$admin.loaded || !$auth.loaded || $appsStore.loading) {
        return null
      }

      // Return URL management - set when *not* logged in
      // will redirect back to this location on auth
      if (
        !$auth.user &&
        !CookieUtils.getCookie(Constants.Cookies.ReturnUrl) &&
        !$auth.postLogout &&
        !$isActive("./auth") &&
        !$isActive("./invite") &&
        !$isActive("./admin")
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
      if (
        (hasAdminUser || cloud) &&
        !$auth.user &&
        !$isActive("./auth") &&
        !$isActive("./invite") &&
        !$isActive("./admin")
      ) {
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

        // Builders without apps should be redirected to the onboarding flow.
        if (
          isBuilder &&
          !$appsStore.loading &&
          $appsStore.apps.length === 0 &&
          !$isActive("./onboarding") &&
          !$isActive("./apps")
        ) {
          return { type: "redirect", path: "./onboarding" }
        }

        // Redirect non-builders to apps unless they're already there
        if (!isBuilder && !$isActive("./apps")) {
          return { type: "redirect", path: "./apps" }
        }

        // Default workspace selection for builders
        if (
          isBuilder &&
          $appsStore.apps.length &&
          !$isActive("./workspace/:application") &&
          !$isActive("./apps") &&
          !$appStore.appId
        ) {
          const defaultApp = $enrichedApps[0]
          return { type: "redirect", path: `./workspace/${defaultApp.devId}` }
        }
      }

      return null
    }
  )

  const validateTenantId = async () => {
    const host = window.location.host
    if (host.includes("localhost:") || !baseUrl) {
      // ignore local dev
      return
    }

    const mainHost = new URL(baseUrl).host
    let urlTenantId
    // remove the main host part
    const hostParts = host.split(mainHost).filter(part => part !== "")
    // if there is a part left, it has to be the tenant ID subdomain
    if (hostParts.length === 1) {
      urlTenantId = hostParts[0].replace(/\./g, "")
    }

    if (user && user.tenantId) {
      if (!urlTenantId) {
        // redirect to correct tenantId subdomain
        if (!window.location.host.includes("localhost")) {
          let redirectUrl = window.location.href
          redirectUrl = redirectUrl.replace("://", `://${user.tenantId}.`)
          window.location.href = redirectUrl
        }
        return
      }

      if (urlTenantId && user.tenantId !== urlTenantId) {
        // user should not be here - play it safe and log them out
        try {
          await auth.logout()
          await auth.setOrganisation(null)
        } catch (error) {
          console.error(
            `Tenant mis-match - "${urlTenantId}" and "${user.tenantId}" - logout`
          )
        }
      }
    } else {
      // no user - set the org according to the url
      await auth.setOrganisation(urlTenantId)
    }
  }
  async function analyticsPing() {
    await API.analyticsPing({ source: "builder" })
  }

  const showFreeTrialBanner = () => {
    return (
      $licensing.license?.plan?.type ===
        Constants.PlanType.ENTERPRISE_BASIC_TRIAL && isOwner
    )
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

        if (usersLimitLockAction) {
          usersLimitLockAction()
        }
      }

      // Validate tenant if in a multi-tenant env
      if (multiTenancyEnabled) {
        await validateTenantId()
      }

      loaded.set(true)

      const invalidated = popNumSessionsInvalidated()
      if (invalidated > 0) {
        notifications.info(invalidationMessage(invalidated), {
          duration: 5000,
        })
      }

      await analyticsPing()
    } catch (err) {
      console.err(err)
      throw err
    }
  }

  onMount(() => {
    initPromise = initBuilder()
    isAuthenticated = !!$auth.user
  })

  // Re-run initBuilder when user logs in
  // Don't re-run on logout as the redirect will handle it
  $: {
    // Only act on login, not initial load or logout
    if (!!$auth.user && isAuthenticated === false) {
      initPromise = initBuilder()
    }
    // Track current state for next evaluation
    if (isAuthenticated !== undefined) {
      isAuthenticated = !!$auth.user
    }
  }

  // Handle navigation actions from derived store
  $: if ($navigationAction) {
    const action = $navigationAction
    switch (action.type) {
      case "setReturnUrl":
        CookieUtils.setCookie(Constants.Cookies.ReturnUrl, action.url)
        break

      case "redirect":
        $redirect(action.path)
        break

      case "returnUrl":
        CookieUtils.removeCookie(Constants.Cookies.ReturnUrl)
        window.location.href = action.url
        break
    }
  }

  // Event handler for the command palette
  const handleKeyDown = e => {
    if (e.key === "k" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      commandPaletteModal.toggle()
    }
  }
</script>

<EnterpriseBasicTrialBanner show={showFreeTrialBanner()} />

<AccountLockedModal
  bind:this={accountLockedModal}
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
    <slot />
  {/if}
{:catch error}
  <div class="init page-error">
    <Layout gap={"S"} alignContent={"center"} justifyItems={"center"}>
      <Heading size={"L"}>Ooops...</Heading>
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
  }
  .loading {
    min-height: 100vh;
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
