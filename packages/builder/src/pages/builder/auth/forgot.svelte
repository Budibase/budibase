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

  let email = ""

  async function forgot() {
    try {
      await auth.forgotPassword(email)
      notifications.success("Email sent - please check your inbox")
    } catch (err) {
      notifications.error("Unable to send reset password link")
    }
  }

  onMount(async () => {
    try {
      await organisation.init()
    } catch (error) {
      notifications.error("Error getting org config")
    }
  })
</script>

<div class="login">
  <div class="main">
    <Layout>
      <Layout noPadding justifyItems="center">
        <img alt="logo" src={$organisation.logoUrl || Logo} />
      </Layout>
      <Layout gap="XS" noPadding>
        <Heading textAlign="center">Forgotten your password?</Heading>
        <Body size="S" textAlign="center">
          No problem! Just enter your account's email address and we'll send you
          a link to reset it.
        </Body>
        <Input label="Email" bind:value={email} />
      </Layout>
      <Layout gap="XS" nopadding>
        <Button cta on:click={forgot} disabled={!email}>
          Reset your password
        </Button>
        <ActionButton quiet on:click={() => $goto("../")}>Back</ActionButton>
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
