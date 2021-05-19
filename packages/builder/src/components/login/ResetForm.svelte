<script>
  import { notifications, Button, Layout, Body, Heading } from "@budibase/bbui"
  import { organisation } from "stores/portal"
  import PasswordRepeatInput from "components/common/users/PasswordRepeatInput.svelte"
  import { params, goto } from "@roxi/routify"
  import { auth } from "stores/backend"

  const resetCode = $params["?code"]
  let password, error

  async function reset() {
    try {
      await auth.resetPassword(password, resetCode)
      notifications.success("Password reset successfully")
      // send them to login if reset successful
      $goto("./login")
    } catch (err) {
      notifications.error("Unable to reset password")
    }
  }
</script>

<div class="login">
  <div class="main">
    <Layout>
      <Layout noPadding justifyItems="center">
        <img src={$organisation.logoUrl || "https://i.imgur.com/ZKyklgF.png"} />
      </Layout>
      <Layout gap="XS" noPadding>
        <Heading textAlign="center">Reset your password</Heading>
        <Body size="S" textAlign="center">
          Please enter the new password you'd like to use.
        </Body>
        <PasswordRepeatInput bind:password bind:error />
      </Layout>
      <Button cta on:click={reset} disabled={error || !resetCode}>
        Reset your password
      </Button>
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

  img {
    width: 48px;
  }
</style>
