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
      group: ["All"],
      developmentAccess: user.builder.global,
    }))

  let createUserModal
  let basicOnboardingModal

  function openBasicOnoboardingModal() {
    createUserModal.hide()
    basicOnboardingModal.show()
  }
</script>

<Layout>
  <div class="heading">
    <Heading>Users</Heading>
    <Body
      >Users are the common denominator in Budibase. Each user is assigned to a
      group that contains apps and permissions. In this section, you can add
      users, or edit and delete an existing user.</Body
    >
  </div>
  <Divider size="S" />

  <div class="users">
    <Heading size="S">Users</Heading>
    <div class="field">
      <Label size="L">Search / filter</Label>
      <Search bind:value={search} placeholder="" />
    </div>
    <div class="buttons">
      <ButtonGroup>
        <Button disabled secondary>Import users</Button>
        <Button overBackground on:click={createUserModal.show}>Add user</Button>
      </ButtonGroup>
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
  </div>
</Layout>

<Modal bind:this={createUserModal}
  ><AddUserModal on:change={openBasicOnoboardingModal} /></Modal
>
<Modal bind:this={basicOnboardingModal}><BasicOnboardingModal {email} /></Modal>

<style>
  .users {
    position: relative;
  }
  .field {
    display: flex;
    align-items: center;
    flex-direction: row;
    grid-gap: var(--spacing-m);
    margin: var(--spacing-xl) 0;
  }
  .field > :global(*) + :global(*) {
    margin-left: var(--spacing-m);
  }
  .buttons {
    position: absolute;
    top: 0;
    right: 0;
  }
</style>
