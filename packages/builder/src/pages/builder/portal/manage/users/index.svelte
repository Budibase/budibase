<script>
  import {
    Heading,
    Body,
    Button,
    ButtonGroup,
    Table,
    Layout,
    Modal,
    ModalContent,
    Icon,
    notifications,
  } from "@budibase/bbui"
  import AddUserModal from "./_components/AddUserModal.svelte"
  import BasicOnboardingModal from "./_components/BasicOnboardingModal.svelte"
  import { users, groups } from "stores/portal"
  import { onMount } from "svelte"
  import GroupsTableRenderer from "./_components/GroupsTableRenderer.svelte"
  import AppsTableRenderer from "./_components/AppsTableRenderer.svelte"
  import NameTableRenderer from "./_components/NameTableRenderer.svelte"
  import SettingsTableRenderer from "./_components/SettingsTableRenderer.svelte"
  import RoleTableRenderer from "./_components/RoleTableRenderer.svelte"
  import { goto } from "@roxi/routify"
  import OnboardingTypeModal from "./_components/OnboardingTypeModal.svelte"
  import PasswordModal from "./_components/PasswordModal.svelte"
  import ImportUsersModal from "./_components/ImportUsersModal.svelte"

  const schema = {
    name: {},
    email: {},
    role: {
      noPropagation: true,
      sortable: false,
    },
    userGroups: { sortable: false, displayName: "User groups" },
    apps: {},
    settings: {
      sortable: false,
      width: "50px",
      displayName: "",
      align: "Right",
    },
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
  let createUserModal,
    basicOnboardingModal,
    inviteConfirmationModal,
    onboardingTypeModal,
    passwordModal,
    importUsersModal

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
      name: user.firstName ? user.firstName + " " + user.lastName : "",
      userGroups,
    }
  })

  function showOnboardingTypeModal() {
    onboardingTypeModal.show()
  }

  function showConfirmationModal(onboardingType) {
    if (onboardingType === "emailOnboarding") {
      inviteConfirmationModal.show()
    } else {
      passwordModal.show()
    }
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
      <Button on:click={importUsersModal.show} icon="Import" primary
        >Import Users</Button
      >
    </ButtonGroup>
    <Table
      on:click={({ detail }) => $goto(`./${detail._id}`)}
      {schema}
      data={enrichedUsers}
      allowEditColumns={false}
      allowEditRows={false}
      allowSelectRows={true}
      showHeaderBorder={false}
      customRenderers={[
        { column: "userGroups", component: GroupsTableRenderer },
        { column: "apps", component: AppsTableRenderer },
        { column: "name", component: NameTableRenderer },
        { column: "settings", component: SettingsTableRenderer },
        { column: "role", component: RoleTableRenderer },
      ]}
    />
  </Layout>
</Layout>

<Modal bind:this={createUserModal}>
  <AddUserModal {showOnboardingTypeModal} />
</Modal>

<Modal bind:this={inviteConfirmationModal}>
  <ModalContent
    showCancelButton={false}
    title="Invites sent!"
    confirmText="Done"
  >
    <Body size="S"
      >Your users should now recieve an email invite to get access to their
      Budibase account</Body
    ></ModalContent
  >
</Modal>

<Modal bind:this={onboardingTypeModal}>
  <OnboardingTypeModal {showConfirmationModal} />
</Modal>

<Modal bind:this={passwordModal}>
  <PasswordModal />
</Modal>

<Modal bind:this={importUsersModal}>
  <ImportUsersModal />
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
</style>
