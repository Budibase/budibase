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
  import { onMount } from "svelte"
  import api from "builderStore/api"

  let adminUser = {}

  async function save(doc) {
    try {
      // Save the admin user
      const response = await api.post(`/api/admin/users`, {
        email: adminUser.email,
        password: adminUser.password,
        roles: {},
        admin: {
          global: true,
        },
      })

      const json = await response.json()
      if (response.status !== 200) throw new Error(json.message)
      notifications.success(`Admin user created.`)
    } catch (err) {
      notifications.error(`Failed to create admin user.`)
    }
  }
</script>

<section>
  <div class="container">
    <header>
      <Heading size="M">Create an admin user</Heading>
      <Body size="S">The admin user has access to everything in budibase.</Body>
    </header>
    <div class="config-form">
      <Layout gap="S">
        <Input label="email" bind:value={adminUser.email} />
        <Input
          label="password"
          type="password"
          bind:value={adminUser.password} />
        <Button cta on:click={save}>Create super admin user</Button>
      </Layout>
    </div>
  </div>
</section>

<style>
  section {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }

  header {
    text-align: center;
    width: 80%;
    margin: 0 auto;
  }

  .config-form {
    margin-bottom: 42px;
  }
</style>
