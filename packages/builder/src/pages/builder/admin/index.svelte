<script>
  import {
    Button,
    Heading,
    notifications,
    Layout,
    Input,
    Body,
    ActionButton,
    Modal,
  } from "@budibase/bbui"
  import { goto } from "@roxi/routify"
  import { API } from "api"
  import { admin, auth } from "stores/portal"
  import PasswordRepeatInput from "components/common/users/PasswordRepeatInput.svelte"
  import ImportAppsModal from "./_components/ImportAppsModal.svelte"
  import Logo from "assets/bb-emblem.svg"
  import { onMount } from "svelte"

  let adminUser = {}
  let error
  let modal

  $: tenantId = $auth.tenantId
  $: multiTenancyEnabled = $admin.multiTenancy
  $: cloud = $admin.cloud
  $: imported = $admin.importComplete

  async function save() {
    try {
      adminUser.tenantId = tenantId
      // Save the admin user
      await API.createAdminUser(adminUser)
      notifications.success("Admin user created")
      await admin.init()
      $goto("../portal")
    } catch (error) {
      notifications.error("Failed to create admin user")
    }
  }

  onMount(async () => {
    if (!cloud) {
      try {
        await admin.checkImportComplete()
      } catch (error) {
        notifications.error("Error checking import status")
      }
    }
  })
</script>

<Modal bind:this={modal} padding={false} width="600px">
  <ImportAppsModal />
</Modal>
<section>
  <div class="container">
    <Layout>
      <img alt="logo" src={Logo} />
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
      <Layout gap="XS" noPadding>
        <Button cta disabled={error} on:click={save}>
          Create super admin user
        </Button>
        {#if multiTenancyEnabled}
          <ActionButton
            quiet
            on:click={() => {
              admin.unload()
              $goto("../auth/org")
            }}
          >
            Change organisation
          </ActionButton>
        {:else if !cloud && !imported}
          <ActionButton
            quiet
            on:click={() => {
              modal.show()
            }}
          >
            Import from cloud
          </ActionButton>
        {/if}
      </Layout>
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
    width: 48px;
    margin: 0 auto;
  }
</style>
