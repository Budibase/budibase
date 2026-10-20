<script lang="ts">
  import { onMount, type Snippet } from "svelte"
  import { isActive, redirect } from "@roxi/routify"
  import { notifications } from "@budibase/bbui"
  import { CookieUtils, Constants } from "@budibase/frontend-core"
  import {
    admin,
    auth,
    licensing,
    organisation,
    translations,
  } from "@/stores/portal"
  import { workspaceStore } from "@/stores/builder"
  import Branding from "@/pages/builder/Branding.svelte"
  import PortalHeader from "./PortalHeader.svelte"

  interface Props {
    children?: Snippet
  }

  let { children }: Props = $props()

  $isActive
  $redirect

  let loaded = $state(false)

  let active = $derived<"apps" | "requests">(
    $isActive("/requests") ? "requests" : "apps"
  )

  $effect(() => {
    if (!$auth.loaded) {
      return
    }
    if (!$auth.user) {
      if (!CookieUtils.getCookie(Constants.Cookies.ReturnUrl)) {
        CookieUtils.setCookie(
          Constants.Cookies.ReturnUrl,
          window.location.pathname
        )
      }
      $redirect("/builder/auth")
    } else if ($auth.user.forceResetPassword) {
      $redirect("/builder/auth/reset")
    }
  })

  onMount(async () => {
    workspaceStore.reset()
    try {
      if (!$auth.user) {
        await auth.getSelf()
        if (!$auth.user) {
          return
        }
        await admin.init()
        await Promise.all([licensing.init(), organisation.init()])
      }
      await translations.init()
    } catch (error) {
      notifications.error("Error loading portal")
    }
    loaded = true
  })
</script>

<Branding />

{#if loaded && $auth.user}
  <div class="portal">
    <div class="header">
      <div class="inner">
        <PortalHeader {active} />
      </div>
    </div>
    <div class="body">
      <div class="inner content">
        {@render children?.()}
      </div>
    </div>
  </div>
{/if}

<style>
  .portal {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .header {
    flex: 0 0 auto;
    padding: 40px 40px 24px;
  }
  .body {
    flex: 1 1 auto;
    min-height: 0;
    overflow-y: auto;
    padding: 16px 40px 80px;
  }
  .inner {
    width: 100%;
    max-width: 740px;
    margin: 0 auto;
  }
  .content {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xl);
  }
</style>
