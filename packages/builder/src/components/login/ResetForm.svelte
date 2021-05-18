<script>
  import { Input, Button, Layout, Body, Heading } from "@budibase/bbui"
  import { params } from "@roxi/routify"
  import { auth } from "stores/backend"

  const resetCode = $params["?code"]
  let password = ""

  async function reset() {}
</script>

<div class="login">
  <div class="main">
    <Layout>
      <Layout noPadding justifyItems="center">
        <img src="https://i.imgur.com/ZKyklgF.png" />
      </Layout>
      <Layout gap="XS" noPadding>
        <Heading textAlign="center">Reset your password</Heading>
        <Body size="S" textAlign="center"
          >Please enter the new password you'd like to use.</Body
        >
        <Input label="Password" bind:value={password} />
      </Layout>
      <Button cta on:click={reset}>Reset your password</Button>
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
