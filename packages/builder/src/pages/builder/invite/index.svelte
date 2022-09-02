<script>
  import { Layout, Heading, Body, Button, notifications } from "@budibase/bbui"
  import { goto, params } from "@roxi/routify"
  import { users, organisation } from "stores/portal"
  import PasswordRepeatInput from "components/common/users/PasswordRepeatInput.svelte"
  import Logo from "assets/bb-emblem.svg"
  import { onMount } from "svelte"

  const inviteCode = $params["?code"]
  let password, error

  $: company = $organisation.company || "Budibase"

  async function acceptInvite() {
    try {
      await users.acceptInvite(inviteCode, password)
      notifications.success("Invitation accepted successfully")
      $goto("../auth/login")
    } catch (error) {
      notifications.error(error.message)
    }
  }

  onMount(async () => {
    try {
      await organisation.init()
    } catch (error) {
      notifications.error("Error getting org config")
    }
  })
</script>

<section>
  <div class="container">
    <Layout>
      <img alt="logo" src={$organisation.logoUrl || Logo} />
      <Layout gap="XS" justifyItems="center" noPadding>
        <Heading size="M">Invitation to {company}</Heading>
        <Body textAlign="center" size="M">
          Please enter a password to get started.
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
    width: 300px;
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
