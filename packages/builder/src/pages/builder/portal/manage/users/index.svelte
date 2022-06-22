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
    Icon,
    notifications,
  } from "@budibase/bbui"
  import TagsRenderer from "./_components/TagsTableRenderer.svelte"
  import AddUserModal from "./_components/AddUserModal.svelte"
  import BasicOnboardingModal from "./_components/BasicOnboardingModal.svelte"
  import { users } from "stores/portal"
  import { onMount } from "svelte"

  const schema = {
    email: {},
    developmentAccess: { displayName: "Development Access", type: "boolean" },
    adminAccess: { displayName: "Admin Access", type: "boolean" },
    // role: { type: "options" },
    group: {},
    // access: {},
    // group: {}
  }

  const accessTypes = [
    {
      icon: "User",
      description: "App user - Only has access to published apps",
    },
    {
      icon: "Hammer",
      description: "Developer - Access to the app builder",
    },
    {
      icon: "Draw",
      description: "Admin - Full access",
    },
  ]

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

  function openBasicOnboardingModal() {
    createUserModal.hide()
    basicOnboardingModal.show()
  }

  onMount(async () => {
    try {
      await users.init()
    } catch (error) {
      notifications.error("Error getting user list")
    }
  })
</script>

<Layout noPadding>
  <Layout gap="XS" noPadding>
    <Heading>Users</Heading>
    <Body>Add users and control who gets access to your published apps</Body>

    <div>
      {#each accessTypes as type}
        <div class="access-description">
          <Icon name={type.icon} />
          <div class="access-text">
            <Body size="S">{type.description}</Body>
          </div>
        </div>
      {/each}
    </div>
  </Layout>
  <Layout gap="S" noPadding>
    <ButtonGroup>
      <Button
        dataCy="add-user"
        on:click={createUserModal.show}
        icon="UserAdd"
        cta>Add Users</Button
      >
      <Button icon="Import" primary>Import Users</Button>
    </ButtonGroup>
    <div class="field">
      <Label size="L">Search / filter</Label>
    </div>
    <Table
      on:click={({ detail }) => $goto(`./${detail._id}`)}
      {schema}
      data={filteredUsers || $users}
      allowEditColumns={false}
      allowEditRows={false}
      allowSelectRows={false}
      showHeaderBorder={false}
      customRenderers={[{ column: "group", component: TagsRenderer }]}
    />
  </Layout>
</Layout>

<Modal bind:this={createUserModal}>
  <AddUserModal on:change={openBasicOnboardingModal} />
</Modal>
<Modal bind:this={basicOnboardingModal}><BasicOnboardingModal {email} /></Modal>

<style>
  .access-description {
    display: flex;
    margin-top: var(--spacing-xl);
    opacity: 0.8;
  }

  .access-text {
    margin-left: var(--spacing-m);
  }

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
