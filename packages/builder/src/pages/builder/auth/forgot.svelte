<script>
  import {
    notifications,
    Input,
    Button,
    Layout,
    Body,
    Heading,
    ActionButton,
  } from "@budibase/bbui"
  import { organisation, auth } from "stores/portal"
  import Logo from "assets/bb-emblem.svg"
  import { onMount } from "svelte"
  import { goto } from "@roxi/routify"
  import { _ as t } from "svelte-i18n"

  let email = ""

  async function forgot() {
    try {
      await auth.forgotPassword(email)
      notifications.success($t('email-sent-please-check-your-inbox'))
    } catch (err) {
      notifications.error($t('unable-to-send-reset-password-link'))
    }
  }

  onMount(async () => {
    await organisation.init()
  })
</script>

<div class="login">
  <div class="main">
    <Layout>
      <Layout noPadding justifyItems="center">
        <img alt="logo" src={$organisation.logoUrl || Logo} />
      </Layout>
      <Layout gap="XS" noPadding>
        <Heading textAlign="center">{ $t('forgotten-your-password') }</Heading>
        <Body size="S" textAlign="center">
          { $t('no-problem-just-enter-your-accounts-email-address-and-well-send-you-a-link-to-reset-it') }
        </Body>
        <Input label={ $t('email') } bind:value={email} />
      </Layout>
      <Layout gap="XS" nopadding>
        <Button cta on:click={forgot} disabled={!email}>
          { $t('reset-your-password') }
        </Button>
        <ActionButton quiet on:click={() => $goto("../")}>{ $t('back') }</ActionButton>
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
