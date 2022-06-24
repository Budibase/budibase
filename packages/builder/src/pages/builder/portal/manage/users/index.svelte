<script>
  import {
    Heading,
    Body,
    Button,
    ButtonGroup,
    Table,
    Layout,
    Modal,
    Icon,
    notifications,
  } from "@budibase/bbui"
  import BasicOnboardingModal from "./_components/BasicOnboardingModal.svelte"
  import { users, groups } from "stores/portal"
  import { onMount } from "svelte"
  import GroupsTableRenderer from "./_components/GroupsTableRenderer.svelte"
  import AppsTableRenderer from "./_components/AppsTableRenderer.svelte"
  import NameTableRenderer from "./_components/NameTableRenderer.svelte"
  import SettingsTableRenderer from "./_components/SettingsTableRenderer.svelte"

  const schema = {
    name: {},
    email: {},
    role: {},
    userGroups: { displayName: "User groups" },
    apps: {},
    settings: { width: "50px", displayName: "", align: "Right" },
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

  $: enrichedUsers = $users.map(user => {
    let userGroups = []
    $groups.forEach(group => {
      if (group.users) {
        group.users?.forEach(y => {
          if (y._id === user._id) {
            userGroups.push(group)
          }
        })
      }
    })
    return {
      ...user,
      userGroups,
    }
  })

  let createUserModal
  let basicOnboardingModal = function openBasicOnboardingModal() {
    createUserModal.hide()
    basicOnboardingModal.show()
  }

  onMount(async () => {
    try {
      await users.init()
      await groups.actions.init()
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
    <Table
      {schema}
      data={enrichedUsers}
      allowEditColumns={false}
      allowEditRows={false}
      allowSelectRows={false}
      showHeaderBorder={false}
      customRenderers={[
        { column: "userGroups", component: GroupsTableRenderer },
        { column: "apps", component: AppsTableRenderer },
        { column: "name", component: NameTableRenderer },
        { column: "settings", component: SettingsTableRenderer },
      ]}
    />
  </Layout>
</Layout>

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
</style>
