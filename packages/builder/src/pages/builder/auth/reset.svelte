<script>
  import {
    Body,
    Button,
    Heading,
    Layout,
    ProgressCircle,
    notifications,
  } from "@budibase/bbui"
  import { goto, params } from "@roxi/routify"
  import { auth, organisation } from "@/stores/portal"
  import Logo from "assets/bb-emblem.svg"
  import { TestimonialPage } from "@budibase/frontend-core/src/components"
  import { onMount } from "svelte"
  import PasswordRepeatInput from "../../../components/common/users/PasswordRepeatInput.svelte"

  const resetCode = $params["?code"]
  let form
  let loaded = false
  let loading = false
  let password
  let passwordError

  $: forceResetPassword = $auth?.user?.forceResetPassword

  async function reset() {
    if (!form.validate() || passwordError) {
      return
    }
    try {
      loading = true
      if (forceResetPassword) {
        await auth.updateSelf({
          password,
          forceResetPassword: false,
        })
        $goto("../portal/")
      } else {
        await auth.resetPassword(password, resetCode)
        notifications.success("Password reset successfully")
        // send them to login if reset successful
        $goto("./login")
      }
    } catch (err) {
      loading = false
      notifications.error(err.message || "Unable to reset password")
    }
  }

  onMount(async () => {
    try {
      await auth.getSelf()
      await organisation.init()
    } catch (error) {
      notifications.error("Error getting org config")
    }
    loaded = true
  })

  const handleKeydown = evt => {
    if (evt.key === "Enter") {
      reset()
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />
<TestimonialPage enabled={$organisation.testimonialsEnabled}>
  <Layout gap="S" noPadding>
    {#if loaded}
      <img alt="logo" src={$organisation.logoUrl || Logo} />
    {/if}
    <Layout gap="S" noPadding>
      <Heading size="M">Reset your password</Heading>
      <Body size="M">Must contain at least 12 characters</Body>
      <PasswordRepeatInput
        bind:passwordForm={form}
        bind:password
        bind:error={passwordError}
      />
      <Button secondary cta on:click={reset}>
        {#if loading}
          <ProgressCircle overBackground={true} size="S" />
        {:else}
          Reset
        {/if}
      </Button>
    </Layout>
    <div />
  </Layout>
</TestimonialPage>

<style>
  img {
    width: 48px;
  }
</style>
