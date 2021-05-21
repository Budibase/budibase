<script>
  import {
    Button,
    Heading,
    notifications,
    Layout,
    Input,
    Body,
  } from "@budibase/bbui"
  import { goto } from "@roxi/routify"
  import api from "builderStore/api"
  import { admin, organisation } from "stores/portal"
  import PasswordRepeatInput from "components/common/users/PasswordRepeatInput.svelte"

  let adminUser = {}
  let error

  async function save() {
    try {
      // Save the admin user
      const response = await api.post(`/api/admin/users/init`, adminUser)
      const json = await response.json()
      if (response.status !== 200) {
        throw new Error(json.message)
      }
      notifications.success(`Admin user created`)
      await admin.init()
      $goto("../portal")
    } catch (err) {
      notifications.error(`Failed to create admin user`)
    }
  }
</script>

<section>
  <div class="container">
    <Layout>
      <img src={$organisation.logoUrl || "https://i.imgur.com/ZKyklgF.png"} />
      <Layout gap="XS" justifyItems="center" noPadding>
        <Heading size="M">Create an admin user</Heading>
        <Body size="M" textAlign="center">
          The admin user has access to everything in Budibase.
        </Body>
      </Layout>
      <Layout gap="XS" noPadding>
        <Input label="Email" bind:value={adminUser.email} />
        <PasswordRepeatInput bind:password={adminUser.password} bind:error />
      </Layout>
      <Button cta disabled={error} on:click={save}>
        Create super admin user
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
