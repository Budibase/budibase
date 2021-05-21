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
    Select,
    Toggle,
    Modal,
    Table,
    ModalContent,
    notifications,
  } from "@budibase/bbui"
  import { fetchData } from "helpers"
  import { users } from "stores/portal"

  import TagsRenderer from "./_components/TagsTableRenderer.svelte"
  import UpdateRolesModal from "./_components/UpdateRolesModal.svelte"
  import ForceResetPasswordModal from "./_components/ForceResetPasswordModal.svelte"

  export let userId
  let deleteUserModal
  let editRolesModal
  let resetPasswordModal

  const roleSchema = {
    name: { displayName: "App" },
    role: {},
  }

  // Merge the Apps list and the roles response to get something that makes sense for the table
  $: appList = Object.keys($apps?.data).map(id => ({
    ...$apps?.data?.[id],
    _id: id,
    role: [$userFetch?.data?.roles?.[id]],
  }))
  let selectedApp

  const userFetch = fetchData(`/api/admin/users/${userId}`)
  const apps = fetchData(`/api/admin/roles`)

  async function deleteUser() {
    const res = await users.delete(userId)
    if (res.message) {
      notifications.success(`User ${$userFetch?.data?.email} deleted.`)
      $goto("./")
    } else {
      notifications.error("Failed to delete user.")
    }
  }

  let toggleDisabled = false

  async function toggleBuilderAccess({ detail }) {
    toggleDisabled = true
    await users.save({ ...$userFetch?.data, builder: { global: detail } })
    await userFetch.refresh()
    toggleDisabled = false
  }

  async function openUpdateRolesModal({ detail }) {
    selectedApp = detail
    editRolesModal.show()
  }
</script>

<Layout noPadding>
  <Layout gap="XS" noPadding>
    <div class="back">
      <ActionButton
        on:click={() => $goto("./")}
        quiet
        size="S"
        icon="BackAndroid"
      >
        Back to users
      </ActionButton>
    </div>
    <Heading>User: {$userFetch?.data?.email}</Heading>
    <Body>
      Change user settings and update their app roles. Also contains the ability
      to delete the user as well as force reset their password.
    </Body>
  </Layout>
  <Divider size="S" />
  <Layout gap="S" noPadding>
    <Heading size="S">General</Heading>
    <div class="fields">
      <div class="field">
        <Label size="L">Email</Label>
        <Input disabled thin value={$userFetch?.data?.email} />
      </div>
      <div class="field">
        <Label size="L">Group(s)</Label>
        <Select disabled options={["All users"]} value="All users" />
      </div>
      <div class="field">
        <Label size="L">First name</Label>
        <Input disabled thin value={$userFetch?.data?.firstName} />
      </div>
      <div class="field">
        <Label size="L">Last name</Label>
        <Input disabled thin value={$userFetch?.data?.lastName} />
      </div>
      <div class="field">
        <Label size="L">Development access?</Label>
        <Toggle
          text=""
          value={$userFetch?.data?.builder?.global}
          on:change={toggleBuilderAccess}
          disabled={toggleDisabled}
        />
      </div>
    </div>
    <div class="regenerate">
      <ActionButton
        size="S"
        icon="Refresh"
        quiet
        on:click={resetPasswordModal.show}>Force password reset</ActionButton
      >
    </div>
  </Layout>
  <Divider size="S" />
  <Layout gap="S" noPadding>
    <Heading size="S">Configure roles</Heading>
    <Table
      on:click={openUpdateRolesModal}
      schema={roleSchema}
      data={appList}
      allowEditColumns={false}
      allowEditRows={false}
      allowSelectRows={false}
      customRenderers={[{ column: "role", component: TagsRenderer }]}
    />
  </Layout>
  <Divider size="S" />
  <Layout gap="XS" noPadding>
    <Heading size="S">Delete user</Heading>
    <Body>Deleting a user completely removes them from your account.</Body>
  </Layout>
  <div class="delete-button">
    <Button warning on:click={deleteUserModal.show}>Delete user</Button>
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
    <Body>
      Are you sure you want to delete <strong>{$userFetch?.data?.email}</strong>
    </Body>
  </ModalContent>
</Modal>
<Modal bind:this={editRolesModal}>
  <UpdateRolesModal
    app={selectedApp}
    user={$userFetch.data}
    on:update={userFetch.refresh}
  />
</Modal>
<Modal bind:this={resetPasswordModal}>
  <ForceResetPasswordModal
    user={$userFetch.data}
    on:update={userFetch.refresh}
  />
</Modal>

<style>
  .fields {
    display: grid;
    grid-gap: var(--spacing-m);
  }
  .field {
    display: grid;
    grid-template-columns: 32% 1fr;
    align-items: center;
  }
  .regenerate {
    position: absolute;
    top: 0;
    right: 0;
  }
</style>
