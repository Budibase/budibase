<script>
  import {
    ActionButton,
    Body,
    Button,
    Divider,
    Heading,
    Layout,
    notifications,
    Link,
  } from "@budibase/bbui"
  import { FancyInput, FancyForm } from "@budibase/bbui"
  import { TestimonialPage } from "@budibase/frontend-core"
  import { goto } from "@roxi/routify"
  import { auth, organisation, oidc, admin } from "stores/portal"
  import GoogleButton from "./_components/GoogleButton.svelte"
  import OIDCButton from "./_components/OIDCButton.svelte"
  import Logo from "assets/bb-emblem.svg"
  import { onMount } from "svelte"

  let username = ""
  let password = ""
  let loaded = false
  let form

  $: company = $organisation.company || "Budibase"
  $: multiTenancyEnabled = $admin.multiTenancy
  $: cloud = $admin.cloud

  async function login() {
    if (!form.validate()) {
      return
    }
    try {
      await auth.login({
        username: username.trim(),
        password,
      })
      if ($auth?.user?.forceResetPassword) {
        $goto("./reset")
      } else {
        notifications.success("Logged in successfully")
        $goto("../portal")
      }
    } catch (err) {
      notifications.error(err.message ? err.message : "Invalid credentials")
    }
  }

  function handleKeydown(evt) {
    if (evt.key === "Enter") login()
  }

  onMount(async () => {
    try {
      await organisation.init()
    } catch (error) {
      notifications.error("Error getting org config")
    }
    loaded = true
  })
</script>

<svelte:window on:keydown={handleKeydown} />

<TestimonialPage>
  <Layout noPadding>
    <Layout noPadding justifyItems="center">
      <img alt="logo" src={$organisation.logoUrl || Logo} />
      <Heading textAlign="center">Log in to {company}</Heading>
    </Layout>
    {#if loaded}
      <GoogleButton />
      <OIDCButton oidcIcon={$oidc.logo} oidcName={$oidc.name} />
    {/if}
    <Divider />
    <FancyForm bind:this={form}>
      <FancyInput
        validate={x => !x && "Please enter your work email"}
        label="Your work email"
        value={username}
        on:change={e => (username = e.detail)}
      />
      <FancyInput
        disabled
        label="Work email"
        value={username}
        on:change={e => (username = e.detail)}
      />
      <FancyInput
        label="Work email"
        value={username}
        on:change={e => (username = e.detail)}
      />
      <FancyInput
        validate={x => !x && "Please enter your password"}
        label="Password"
        type="password"
        value={password}
        on:change={e => (password = e.detail)}
      />
    </FancyForm>
    <Layout gap="XS" noPadding justifyItems="center">
      <div>
        <Button cta on:click={login}>
          Log in to {company}
        </Button>
      </div>

      <ActionButton quiet on:click={() => $goto("./forgot")}>
        Forgot password?
      </ActionButton>
      {#if multiTenancyEnabled && !cloud}
        <ActionButton
          quiet
          on:click={() => {
            admin.unload()
            $goto("./org")
          }}
        >
          Change organisation
        </ActionButton>
      {/if}
    </Layout>
    {#if cloud}
      <Body size="xs" textAlign="center">
        By using Budibase Cloud
        <br />
        you are agreeing to our
        <Link href="https://budibase.com/eula" target="_blank">
          License Agreement
        </Link>
      </Body>
    {/if}
  </Layout>
</TestimonialPage>

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
