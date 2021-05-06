<script>
  import {
    Button,
    Heading,
    Label,
    notifications,
    Layout,
    Input,
    Body,
  } from "@budibase/bbui"
  import { goto } from "@roxi/routify"
  import { onMount } from "svelte"
  import api from "builderStore/api"

  let adminUser = {}

  async function save() {
    try {
      // Save the admin user
      const response = await api.post(`/api/admin/users/init`, adminUser)

      const json = await response.json()
      if (response.status !== 200) throw new Error(json.message)
      notifications.success(`Admin user created.`)
      $goto("../portal")
    } catch (err) {
      notifications.error(`Failed to create admin user.`)
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
        <Heading size="M">Create an admin user</Heading>
        <Body size="M"
          >The admin user has access to everything in Budibase.</Body
        >
      </Layout>
    </div>
    <Layout gap="XS">
      <Input label="Email" bind:value={adminUser.email} />
      <Input label="Password" type="password" bind:value={adminUser.password} />
    </Layout>
    <Layout gap="S">
      <Button cta on:click={save}>Create super admin user</Button>
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
