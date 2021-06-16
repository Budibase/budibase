<script>
  import { Layout, Heading, Body, Button, notifications } from "@budibase/bbui"
  import { goto, params } from "@roxi/routify"
  import { users } from "stores/portal"
  import PasswordRepeatInput from "components/common/users/PasswordRepeatInput.svelte"
  import Logo from "assets/bb-emblem.svg"

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
    <Layout>
      <img src={Logo} alt="logo" />
      <Layout gap="XS" justifyItems="center" noPadding>
        <Heading size="M">Accept Invitation</Heading>
        <Body textAlign="center" size="M">
          Please enter a password to set up your user.
        </Body>
      </Layout>
      <PasswordRepeatInput bind:error bind:password />
      <Button disabled={error} cta on:click={acceptInvite}>
        Accept invite
      </Button>
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
