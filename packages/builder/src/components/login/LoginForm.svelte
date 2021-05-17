<script>
  import {goto} from "@roxi/routify"
  import {
    notifications,
    Input,
    Button,
    Divider,
    ActionButton,
    Layout,
    Body,
    Heading,
  } from "@budibase/bbui"
  import GoogleButton from "./GoogleButton.svelte"
  import {auth} from "stores/backend"

  let username = ""
  let password = ""

  async function login() {
    try {
      await auth.login({
        username,
        password,
      })
      notifications.success("Logged in successfully")
      $goto("../portal")
    } catch (err) {
      console.error(err)
      notifications.error("Invalid credentials")
    }
  }

  async function forgot() {

  }
</script>

<div class="login">
  <div class="main">
    <Layout noPadding>
      <Layout noPadding justifyItems="center">
        <img src="https://i.imgur.com/ZKyklgF.png" />
        <Heading>Sign in to Budibase</Heading>
      </Layout>
      <div class="sso">
        <GoogleButton />
      </div>
      <Divider noGrid />
      <Layout gap="XS" noPadding>
        <Body size="S" textAlign="center">Sign in with email</Body>
        <Input label="Email" bind:value={username} />
        <Input label="Password" type="password" on:change bind:value={password} />
      </Layout>
      <Button cta on:click={login}>Sign in to Budibase</Button>
      <ActionButton quiet on:click={forgot}>Forgot Password?</ActionButton>
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
    width: 260px;
  }

  .center {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  img {
    width: 48px;
  }

  .sso {
    width: 100%;
  }

  .login-buttons :global(>*) {
    width: 100%;
  }
</style>
