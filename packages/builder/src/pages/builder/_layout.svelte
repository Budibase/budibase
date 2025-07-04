<script>
  import { isActive, redirect, params } from "@roxi/routify"
  import { admin, auth, licensing, navigation } from "@/stores/portal"
  import { onMount } from "svelte"
  import {
    CookieUtils,
    Constants,
    popNumSessionsInvalidated,
    invalidationMessage,
  } from "@budibase/frontend-core"
  import { API } from "@/api"
  import Branding from "./Branding.svelte"
  import ContextMenu from "@/components/ContextMenu.svelte"
  import CommandPalette from "@/components/commandPalette/CommandPalette.svelte"
  import { Modal, notifications } from "@budibase/bbui"

  let loaded = false
  let commandPaletteModal

  $: multiTenancyEnabled = $admin.multiTenancy
  $: hasAdminUser = $admin?.checklist?.adminUser?.checked
  $: baseUrl = $admin?.baseUrl
  $: tenantSet = $auth.tenantSet
  $: cloud = $admin?.cloud
  $: user = $auth.user

  $: useAccountPortal = cloud && !$admin.disableAccountPortal

  navigation.init($redirect)

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

  onMount(async () => {
    try {
      await auth.getSelf()
      await admin.init()

      if ($admin.maintenance.length > 0) {
        $redirect("./maintenance")
      }

      if ($auth.user) {
        await licensing.init()
      }

      // Set init info if present
      if ($params["?template"]) {
        await auth.setInitInfo({ init_template: $params["?template"] })
      }

      // Validate tenant if in a multi-tenant env
      if (multiTenancyEnabled) {
        await validateTenantId()
      }
    } catch (error) {
      // Don't show a notification here, as we might 403 initially due to not
      // being logged in
    }
    loaded = true

    const invalidated = popNumSessionsInvalidated()
    if (invalidated > 0) {
      notifications.info(invalidationMessage(invalidated), {
        duration: 5000,
      })
    }

    // lastly
    await analyticsPing()
  })

  $: {
    const apiReady = $admin.loaded && $auth.loaded

    // firstly, set the return url
    if (
      loaded &&
      apiReady &&
      !$auth.user &&
      !CookieUtils.getCookie(Constants.Cookies.ReturnUrl) &&
      // logout triggers a page refresh, so we don't want to set the return url
      !$auth.postLogout &&
      // don't set the return url on pre-login pages
      !$isActive("./auth") &&
      !$isActive("./invite") &&
      !$isActive("./admin")
    ) {
      const url = window.location.pathname
      CookieUtils.setCookie(Constants.Cookies.ReturnUrl, url)
    }

    // if tenant is not set go to it
    if (
      loaded &&
      !useAccountPortal &&
      apiReady &&
      multiTenancyEnabled &&
      !tenantSet
    ) {
      $redirect("./auth/org")
    }
    // Force creation of an admin user if one doesn't exist
    else if (loaded && !useAccountPortal && apiReady && !hasAdminUser) {
      $redirect("./admin")
    }
    // Redirect to log in at any time if the user isn't authenticated
    else if (
      loaded &&
      (hasAdminUser || cloud) &&
      !$auth.user &&
      !$isActive("./auth") &&
      !$isActive("./invite") &&
      !$isActive("./admin")
    ) {
      $redirect("./auth")
    }
    // check if password reset required for user
    else if ($auth.user?.forceResetPassword) {
      $redirect("./auth/reset")
    }
    // lastly, redirect to the return url if it has been set
    else if (loaded && apiReady && $auth.user) {
      const returnUrl = CookieUtils.getCookie(Constants.Cookies.ReturnUrl)
      if (returnUrl) {
        CookieUtils.removeCookie(Constants.Cookies.ReturnUrl)
        window.location.href = returnUrl
      }
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

<!--Portal branding overrides -->
<Branding />
<ContextMenu />

<svelte:window on:keydown={handleKeyDown} />
<Modal bind:this={commandPaletteModal} zIndex={999999}>
  <CommandPalette />
</Modal>

{#if loaded}
  <slot />
{/if}
