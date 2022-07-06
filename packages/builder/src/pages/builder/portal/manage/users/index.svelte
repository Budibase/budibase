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
    Pagination,
  } from "@budibase/bbui"
  import AddUserModal from "./_components/AddUserModal.svelte"
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
  import analytics, { Events } from "analytics"
  import { createPaginationStore } from "helpers/pagination"

  const schema = {
    name: {},
    email: {},
    role: {
      noPropagation: true,
      sortable: false,
    },
    userGroups: { sortable: false, displayName: "User groups" },
    apps: { width: "120px" },
    settings: {
      sortable: false,
      width: "60px",
      displayName: "",
      align: "Right",
    },
  }

  $: userData = []

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

  let email
  let enrichedUsers = []
  let createUserModal,
    inviteConfirmationModal,
    onboardingTypeModal,
    passwordModal,
    importUsersModal

  let pageInfo = createPaginationStore()
  let prevSearch = undefined,
    search = undefined
  $: page = $pageInfo.page
  $: fetchUsers(page, search)

  $: {
    enrichedUsers = $users.data?.map(user => {
      let userGroups = []
      let userApps = []
      $groups.forEach(group => {
        console.log(group)
        if (group.users) {
          group.users?.forEach(y => {
            if (y._id === user._id) {
              console.log("hello")
              userGroups.push(group)
              userApps = group.apps
            }
          })
        }
      })
      return {
        ...user,
        name: user.firstName ? user.firstName + " " + user.lastName : "",
        userGroups,
        apps: [...new Set(Object.keys(user.roles))],
      }
    })
  }
  function showOnboardingTypeModal() {
    onboardingTypeModal.show()
  }

  async function createUserFlow() {
    let emails = userData.map(x => x.email)
    try {
      const res = await users.invite({
        emails: emails,
        builder: true,
        admin: true,
      })
      notifications.success(res.message)
      analytics.captureEvent(Events.USER.INVITE, { type: "Email onboarding" })
      inviteConfirmationModal.show()
    } catch (error) {
      console.log(error)
      notifications.error("Error inviting user")
    }
  }

  async function createUser() {
    try {
      await users.create({
        email: $email,
        password,
        builder,
        admin,
        forceResetPassword: true,
      })
      notifications.success("Successfully created user")
    } catch (error) {
      notifications.error("Error creating user")
    }
  }

  async function chooseCreationType(onboardingType) {
    if (onboardingType === "emailOnboarding") {
      createUserFlow()
    } else {
      let newUser = await users.create({
        email: "auser5@test.com",
        password: Math.random().toString(36).slice(2, 20),
        builder: true,
        admin: true,
        forceResetPassword: true,
      })

      passwordModal.show()
    }
  }

  onMount(async () => {
    try {
      await groups.actions.init()
    } catch (error) {
      console.log(error)
      notifications.error("Error fetching User Group data")
    }
  })

  async function fetchUsers(page, search) {
    if ($pageInfo.loading) {
      return
    }
    // need to remove the page if they've started searching
    if (search && !prevSearch) {
      pageInfo.reset()
      page = undefined
    }
    prevSearch = search
    try {
      pageInfo.loading()
      await users.search({ page, search })
      pageInfo.fetched($users.hasNextPage, $users.nextPage)
    } catch (error) {
      notifications.error("Error getting user list")
    }
  }
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
    <div class="pagination">
      <Pagination
        page={$pageInfo.pageNumber}
        hasPrevPage={$pageInfo.loading ? false : $pageInfo.hasPrevPage}
        hasNextPage={$pageInfo.loading ? false : $pageInfo.hasNextPage}
        goToPrevPage={pageInfo.prevPage}
        goToNextPage={pageInfo.nextPage}
      />
    </div>
  </Layout>
</Layout>

<Modal bind:this={createUserModal}>
  <AddUserModal
    on:change={e => (userData = e.detail)}
    on:created={async () => {
      pageInfo.reset()
      await fetchUsers()
    }}
    {showOnboardingTypeModal}
  />
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
  <OnboardingTypeModal {chooseCreationType} />
</Modal>

<Modal bind:this={passwordModal}>
  <PasswordModal />
</Modal>

<Modal bind:this={importUsersModal}>
  <ImportUsersModal {showOnboardingTypeModal} />
</Modal>

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
