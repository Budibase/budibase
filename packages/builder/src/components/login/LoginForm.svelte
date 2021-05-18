<script>
  import { goto } from "@roxi/routify"
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
  import { auth } from "stores/backend"

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
</script>

<div class="login">
  <div class="main">
    <Layout>
      <Layout noPadding justifyItems="center">
        <img src="https://i.imgur.com/ZKyklgF.png" />
        <Heading>Sign in to Budibase</Heading>
      </Layout>
      <GoogleButton />
      <Layout gap="XS" noPadding>
        <Divider noGrid />
        <Body size="S" textAlign="center">Sign in with email</Body>
        <Input label="Email" bind:value={username} />
        <Input
          label="Password"
          type="password"
          on:change
          bind:value={password}
        />
      </Layout>
      <Layout gap="S" noPadding>
        <Button cta on:click={login}>Sign in to Budibase</Button>
        <ActionButton quiet on:click={() => $goto("./forgot")}
          >Forgot password?</ActionButton
        >
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
