<script>
  import { goto } from "@roxi/routify"
  import {
    ActionButton,
    Button,
    Layout,
    Heading,
    Body,
    Divider,
    Label,
    Input,
    Modal,
    Table,
    ModalContent,
    notifications,
  } from "@budibase/bbui"
  import { fetchData } from "helpers"
  import { users } from "stores/portal"

  import UpdateRolesModal from "./_components/UpdateRolesModal.svelte"

  export let userId
  let deleteUserModal
  let editRolesModal

  const roleSchema = {
    name: { displayName: "App" },
    role: { type: "options" },
  }

  // Merge the Apps list and the roles response to get something that makes sense for the table
  $: appList = Object.keys($apps?.data).map(app => ({
    name: $apps?.data?.[app]?.name,
    role: $roleFetch?.data?.roles?.[app],
  }))
  let selectedApp

  const roleFetch = fetchData(`/api/admin/users/${userId}`)
  const apps = fetchData(`/api/admin/roles`)

  async function deleteUser() {
    const res = await users.del(userId)
    if (res.message) {
      notifications.success(`User ${$roleFetch?.data?.email} deleted.`)
      $goto("./")
    } else {
      notifications.error("Failed to delete user.")
    }
  }

  async function openUpdateRolesModal({ detail }) {
    selectedApp = detail
    editRolesModal.show()
  }
</script>

<Layout noPadding gap="XS">
  <div class="back">
    <ActionButton on:click={() => $goto("./")} quiet size="S" icon="BackAndroid"
      >Back to users</ActionButton
    >
  </div>
  <div class="heading">
    <Layout noPadding gap="XS">
      <Heading>User: {$roleFetch?.data?.email}</Heading>
      <Body
        >Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis porro
        ut nesciunt ipsam perspiciatis aliquam et hic minus alias beatae. Odit
        veritatis quos quas laborum magnam tenetur perspiciatis ex hic.
      </Body>
      <Body />
    </Layout>
  </div>
  <Divider size="S" />
  <div class="general">
    <Heading size="S">General</Heading>
    <div class="fields">
      <div class="field">
        <Label size="L">Email</Label>
        <Input disabled thin value={$roleFetch?.data?.email} />
      </div>
    </div>
    <div class="regenerate">
      <ActionButton size="S" icon="Refresh" quiet
        >Regenerate password</ActionButton
      >
    </div>
  </div>
  <Divider size="S" />
  <div class="roles">
    <Heading size="S">Configure roles</Heading>
    <Table
      on:click={openUpdateRolesModal}
      schema={roleSchema}
      data={appList}
      allowEditColumns={false}
      allowEditRows={false}
      allowSelectRows={false}
    />
  </div>
  <Divider size="S" />
  <div class="delete">
    <Layout gap="S" noPadding
      ><Heading size="S">Delete user</Heading>
      <Body>Deleting a user completely removes them from your account.</Body>
      <div class="delete-button">
        <Button warning on:click={deleteUserModal.show}>Delete user</Button>
      </div></Layout
    >
  </div>
</Layout>

<Modal bind:this={deleteUserModal}>
  <ModalContent
    warning
    onConfirm={deleteUser}
    title="Delete User"
    confirmText="Delete user"
    cancelText="Cancel"
    showCloseIcon={false}
  >
    <Body
      >Are you sure you want to delete <strong>{$roleFetch?.data?.email}</strong
      ></Body
    >
  </ModalContent>
</Modal>
<Modal bind:this={editRolesModal}>
  <UpdateRolesModal
    app={selectedApp}
    user={$roleFetch.data}
    on:update={roleFetch.refresh}
  />
</Modal>

<style>
  .fields {
    display: grid;
    grid-gap: var(--spacing-m);
    margin-top: var(--spacing-xl);
  }
  .field {
    display: grid;
    grid-template-columns: 32% 1fr;
    align-items: center;
  }
  .heading {
    margin-bottom: var(--spacing-xl);
  }
  .general {
    position: relative;
    margin: var(--spacing-xl) 0;
  }
  .roles {
    margin: var(--spacing-xl) 0;
  }
  .delete {
    margin-top: var(--spacing-xl);
  }
  .regenerate {
    position: absolute;
    top: 0;
    right: 0;
  }
</style>
