<script>
  import {
    ActionButton,
    Body,
    Button,
    Divider,
    Heading,
    Input,
    Layout,
    notifications,
  } from "@budibase/bbui"
  import { goto, params } from "@roxi/routify"
  import { auth, organisation, oidc, admin } from "stores/portal"
  import GoogleButton from "./_components/GoogleButton.svelte"
  import OIDCButton from "./_components/OIDCButton.svelte"
  import Logo from "assets/bb-emblem.svg"
  import { onMount } from "svelte"
  import { _ as t } from "svelte-i18n"

  let username = ""
  let password = ""
  let loaded = false

  $: company = $organisation.company || "Budibase"
  $: multiTenancyEnabled = $admin.multiTenancy

  async function login() {
    try {
      await auth.login({
        username,
        password,
      })
      if ($auth?.user?.forceResetPassword) {
        $goto("./reset")
      } else {
        if ($params["?returnUrl"]) {
          window.location = decodeURIComponent($params["?returnUrl"])
        } else {
          notifications.success($t('logged-in-successfully'))
          $goto("../portal")
        }
      }
    } catch (err) {
      console.error(err)
      notifications.error($t('invalid-credentials'))
    }
  }

  function handleKeydown(evt) {
    if (evt.key === "Enter") login()
  }

  onMount(async () => {
    await organisation.init()
    loaded = true
  })
</script>

<svelte:window on:keydown={handleKeydown} />
<div class="login">
  <div class="main">
    <Layout>
      <Layout noPadding justifyItems="center">
        <img alt="logo" src={$organisation.logoUrl || Logo} />
        <Heading>{ $t('sign-in-to') } {company}</Heading>
      </Layout>
      {#if loaded}
        <GoogleButton />
        <OIDCButton oidcIcon={$oidc.logo} oidcName={$oidc.name} />
      {/if}
      <Divider noGrid />
      <Layout gap="XS" noPadding>
        <Body size="S" textAlign="center">{ $t('sign-in-with-email') }</Body>
        <Input label={ $t('email') } bind:value={username} />
        <Input
          label={ $t('password') }
          type="password"
          on:change
          bind:value={password}
        />
      </Layout>
      <Layout gap="XS" noPadding>
        <Button cta on:click={login}>{ $t('sign-in-to') } {company}</Button>
        <ActionButton quiet on:click={() => $goto("./forgot")}>
          { $t('forgot-password') }
        </ActionButton>
        {#if multiTenancyEnabled}
          <ActionButton
            quiet
            on:click={() => {
              admin.unload()
              $goto("./org")
            }}
          >
            { $t('change-organisation') }
          </ActionButton>
        {/if}
      </Layout>
    </Layout>
  </div>
</div>

<style>
  .login {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .main {
    width: 300px;
  }

  img {
    width: 48px;
  }
</style>
