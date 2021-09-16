<script>
  import { goto } from "@roxi/routify"
  import {
    Heading,
    Body,
    Divider,
    Button,
    ButtonGroup,
    Search,
    Table,
    Label,
    Layout,
    Modal,
  } from "@budibase/bbui"
  import TagsRenderer from "./_components/TagsTableRenderer.svelte"
  import AddUserModal from "./_components/AddUserModal.svelte"
  import BasicOnboardingModal from "./_components/BasicOnboardingModal.svelte"
  import { users } from "stores/portal"

  users.init()

  const schema = {
    email: {},
    developmentAccess: { displayName: "Development Access", type: "boolean" },
    adminAccess: { displayName: "Admin Access", type: "boolean" },
    // role: { type: "options" },
    group: {},
    // access: {},
    // group: {}
  }

  let search
  let email
  $: filteredUsers = $users
    .filter(user => user.email.includes(search || ""))
    .map(user => ({
      ...user,
      group: ["All users"],
      developmentAccess: !!user.builder?.global,
      adminAccess: !!user.admin?.global,
    }))

  let createUserModal
  let basicOnboardingModal

  function openBasicOnoboardingModal() {
    createUserModal.hide()
    basicOnboardingModal.show()
  }
</script>

<Layout noPadding>
  <Layout gap="XS" noPadding>
    <Heading>Users</Heading>
    <Body>
      Each user is assigned to a group that contains apps and permissions. In
      this section, you can add users, or edit and delete an existing user.
    </Body>
  </Layout>
  <Divider size="S" />
  <Layout gap="S" noPadding>
    <div class="users-heading">
      <Heading size="S">Users</Heading>
      <ButtonGroup>
        <Button disabled secondary>Import users</Button>
        <Button primary on:click={createUserModal.show}>Add user</Button>
      </ButtonGroup>
    </div>
    <div class="field">
      <Label size="L">Search / filter</Label>
      <Search bind:value={search} placeholder="" />
    </div>
    <Table
      on:click={({ detail }) => $goto(`./${detail._id}`)}
      {schema}
      data={filteredUsers || $users}
      allowEditColumns={false}
      allowEditRows={false}
      allowSelectRows={false}
      customRenderers={[{ column: "group", component: TagsRenderer }]}
    />
  </Layout>
</Layout>

<Modal bind:this={createUserModal}>
  <AddUserModal on:change={openBasicOnoboardingModal} />
</Modal>
<Modal bind:this={basicOnboardingModal}><BasicOnboardingModal {email} /></Modal>

<style>
  .field {
    display: flex;
    align-items: center;
    flex-direction: row;
    grid-gap: var(--spacing-m);
  }
  .field > :global(*) + :global(*) {
    margin-left: var(--spacing-m);
  }
  .users-heading {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
</style>
