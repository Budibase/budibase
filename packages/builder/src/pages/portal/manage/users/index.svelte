<script>
  import {
    Heading,
    Body,
    Divider,
    Button,
    ButtonGroup,
    Combobox,
    Table,
    Label,
    Layout,
    Modal,
    ModalContent,
  } from "@budibase/bbui"
  import AddUserModal from "./_components/AddUserModal.svelte"
  import { users } from "stores/portal"

  users.init()

  const schema = {
    email: {},
    status: {},
    // access: {},
    // group: {}
  }

  export let modal
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
      <Label>Search / filter</Label>
      <Combobox placeholder="" />
    </div>
    <div class="buttons">
      <ButtonGroup>
        <Button tooltip="Coming soon." disabled secondary>Import users</Button>
        <Button overBackground on:click={modal.show}>Add user</Button>
      </ButtonGroup>
    </div>
    <Table
      {schema}
      data={$users}
      allowEditColumns={false}
      allowEditRows={false}
      allowSelectRows={false}
    />
  </div>
</Layout>

<Modal bind:this={modal}><AddUserModal /></Modal>

<style>
  .users {
    position: relative;
  }
  .field {
    display: flex;
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
