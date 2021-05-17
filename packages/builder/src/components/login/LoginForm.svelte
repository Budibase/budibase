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
    <img src="https://i.imgur.com/ZKyklgF.png" />
    <h2>Sign in to Budibase</h2>
    <div class="sso">
      <GoogleButton />
    </div>
    <Divider noGrid />
    <Body size="S">Sign in with email</Body>
    <Layout gap="XS">
      <Input label="Email" bind:value={username} />
      <Input label="Password" type="password" on:change bind:value={password} />
    </Layout>
    <div class="login-buttons">
      <Button cta on:click={login}>Sign in to Budibase</Button>
      <ActionButton quiet on:click={forgot}>Forgot Password?</ActionButton>
    </div>
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
    width: 240px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .main img {
    width: 48px;
  }

  .sso {
    width: 100%;
    margin-bottom: var(--spacing-l);
    margin-top: var(--spacing-s);
  }

  .login-buttons :global(>*) {
    margin-top: var(--spacing-l);
    width: 100%;
  }
</style>
