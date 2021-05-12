<script>
  import {
    Layout,
    Heading,
    Body,
    Input,
    Button,
    notifications,
  } from "@budibase/bbui"
  import { goto, params } from "@roxi/routify"
  import { createValidationStore, requiredValidator } from "helpers/validation"
  import { users } from "stores/portal"

  const [password, passwordError, passwordTouched] = createValidationStore(
    "",
    requiredValidator
  )
  const [repeat, _, repeatTouched] = createValidationStore(
    "",
    requiredValidator
  )
  const inviteCode = $params["?code"]

  async function acceptInvite() {
    try {
      const res = await users.acceptInvite(inviteCode, $password)
      if (!res) {
        throw new Error(res.message)
      }
      notifications.success(`User created.`)
      $goto("../auth/login")
    } catch (err) {
      notifications.error(err)
    }
  }
</script>

<section>
  <div class="container">
    <Layout gap="XS">
      <img src="https://i.imgur.com/ZKyklgF.png" />
    </Layout>
    <div class="center">
      <Layout gap="XS">
        <Heading size="M">Accept Invitation</Heading>
        <Body size="M">Please enter a password to setup your user.</Body>
      </Layout>
    </div>
    <Layout gap="XS">
      <Input
        label="Password"
        type="password"
        error={$passwordTouched && $passwordError}
        bind:value={$password}
      />
      <Input
        label="Repeat Password"
        type="password"
        error={$repeatTouched &&
          $password !== $repeat &&
          "Passwords must match"}
        bind:value={$repeat}
      />
    </Layout>
    <Layout gap="S">
      <Button
        disabled={!$passwordTouched || !$repeatTouched || $password !== $repeat}
        cta
        on:click={acceptInvite}>Accept invite</Button
      >
    </Layout>
  </div>
</section>

<style>
  section {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
  .container {
    margin: 0 auto;
    width: 260px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
  }
  .center {
    text-align: center;
  }
  img {
    width: 40px;
    margin: 0 auto;
  }
</style>
