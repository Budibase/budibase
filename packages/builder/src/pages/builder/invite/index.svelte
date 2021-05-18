<script>
  import {
    Layout,
    Heading,
    Body,
    Button,
    notifications,
  } from "@budibase/bbui"
  import { goto, params } from "@roxi/routify"
  import PasswordRepeatInput from "components/common/users/PasswordRepeatInput.svelte"
  import { users } from "stores/portal"

  const inviteCode = $params["?code"]
  let password, error

  async function acceptInvite() {
    try {
      const res = await users.acceptInvite(inviteCode, password)
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
    <Layout gap="XS">
      <Heading textAlign="center" size="M">Accept Invitation</Heading>
      <Body textAlign="center" size="S">Please enter a password to setup your user.</Body>
      <PasswordRepeatInput bind:error bind:password />
    </Layout>
    <Layout gap="S">
      <Button
        disabled={error}
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
  img {
    width: 40px;
    margin: 0 auto;
  }
</style>
