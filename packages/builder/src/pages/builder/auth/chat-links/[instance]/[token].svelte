<script lang="ts">
  import { API } from "@/api"
  import { auth } from "@/stores/portal"
  import {
    Body,
    Button,
    Heading,
    Layout,
  } from "@budibase/bbui"
  import { Constants, CookieUtils } from "@budibase/frontend-core"
  import type { ChatIdentityLinkSessionView } from "@budibase/types"
  import { goto as gotoStore } from "@roxi/routify"
  import { onMount } from "svelte"

  $: goto = $gotoStore
  $: instance = $params.instance || ""
  $: token = $params.token || ""

  let loading = true
  let confirming = false
  let confirmed = false
  let linkSession: ChatIdentityLinkSessionView | null = null
  let error = ""

  const getErrorMessage = (err: unknown, fallback: string) =>
    err instanceof Error ? err.message : fallback

  const loadLinkSession = async () => {
    loading = true
    error = ""

    try {
      linkSession = await API.fetchChatIdentityLinkSession(instance, token)
    } catch (err) {
      error = getErrorMessage(err, "Link token is invalid or has expired")
    } finally {
      loading = false
    }
  }

  const redirectToLogin = () => {
    CookieUtils.setCookie(Constants.Cookies.ReturnUrl, window.location.pathname)
    goto("/builder/auth/login")
  }

  const confirmLink = async () => {
    confirming = true
    error = ""

    try {
      await API.confirmChatIdentityLinkSession(instance, token)
      confirmed = true
    } catch (err) {
      error = getErrorMessage(err, "Failed to confirm chat link")
    } finally {
      confirming = false
    }
  }

  onMount(async () => {
    await auth.getSelf()

    if (!$auth.user) {
      redirectToLogin()
      return
    }

    await loadLinkSession()
  })

  $: if ($auth.loaded && !$auth.user && !loading) {
    redirectToLogin()
  }

  $: externalIdentity =
    linkSession?.externalUserName || linkSession?.externalUserId || ""
</script>

<div class="page-container">
  <div class="content">
    <Layout gap="M" justifyItems="center" noPadding>
      {#if loading}
        <Heading size="M" textAlign="center">Loading chat link...</Heading>
      {:else if error}
        <Heading size="M" textAlign="center">Chat link unavailable</Heading>
        <Body size="M" textAlign="center">{error}</Body>
      {:else if confirmed}
        <Heading size="M" textAlign="center">
          Authentication succeeded
        </Heading>
        <Body size="M" textAlign="center">
          Your Budibase account is now linked. You can return to your chat to
          continue.
        </Body>
      {:else if linkSession}
        <Heading size="M" textAlign="center">Confirm chat account link</Heading>
        <Body size="M" textAlign="center">
          Link your Budibase account to <strong>{externalIdentity}</strong> on
          <strong>{linkSession.providerLabel}</strong>.
        </Body>
        {#if linkSession.alreadyLinked}
          <Body size="S" textAlign="center">
            Completing this link will replace the previous Budibase user mapping.
          </Body>
        {/if}
        <Button cta size="L" disabled={confirming} on:click={confirmLink}>
          {confirming ? "Linking..." : "Link account"}
        </Button>
      {/if}
    </Layout>
  </div>
</div>

<style>
  .page-container {
    min-height: 100vh;
    display: grid;
    place-items: center;
    padding: 24px;
  }

  .content {
    width: 100%;
    max-width: 440px;
  }
</style>
