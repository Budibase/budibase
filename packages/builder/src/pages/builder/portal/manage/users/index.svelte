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
    Search,
    Label,
  } from "@budibase/bbui"
  import AddUserModal from "./_components/AddUserModal.svelte"
  import { users, groups, auth } from "stores/portal"
  import { onMount } from "svelte"
  import DeleteRowsButton from "components/backend/DataTable/buttons/DeleteRowsButton.svelte"
  import GroupsTableRenderer from "./_components/GroupsTableRenderer.svelte"
  import AppsTableRenderer from "./_components/AppsTableRenderer.svelte"
  import NameTableRenderer from "./_components/NameTableRenderer.svelte"
  import RoleTableRenderer from "./_components/RoleTableRenderer.svelte"
  import { goto } from "@roxi/routify"
  import OnboardingTypeModal from "./_components/OnboardingTypeModal.svelte"
  import PasswordModal from "./_components/PasswordModal.svelte"
  import ImportUsersModal from "./_components/ImportUsersModal.svelte"
  import { createPaginationStore } from "helpers/pagination"
  import { Constants } from "@budibase/frontend-core"

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

  //let email
  let enrichedUsers = []
  let createUserModal,
    inviteConfirmationModal,
    onboardingTypeModal,
    passwordModal,
    importUsersModal

  let pageInfo = createPaginationStore()
  let prevEmail = undefined,
    searchEmail = undefined

  let selectedRows = []
  let customRenderers = [
    { column: "userGroups", component: GroupsTableRenderer },
    { column: "apps", component: AppsTableRenderer },
    { column: "name", component: NameTableRenderer },
    { column: "role", component: RoleTableRenderer },
  ]

  $: hasGroupsLicense = $auth.user?.license.features.includes(
    Constants.Features.USER_GROUPS
  )

  $: schema = {
    name: {},
    email: {},
    role: {
      noPropagation: true,
      sortable: false,
    },
    ...(hasGroupsLicense && {
      userGroups: { sortable: false, displayName: "User groups" },
    }),
    apps: { width: "120px" },
    settings: {
      sortable: false,
      width: "60px",
      displayName: "",
      align: "Right",
    },
  }

  $: userData = []

  $: page = $pageInfo.page
  $: fetchUsers(page, searchEmail)
  $: {
    enrichedUsers = $users.data?.map(user => {
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
        apps: [...new Set(Object.keys(user.roles))],
      }
    })
  }
  const showOnboardingTypeModal = async addUsersData => {
    userData = await removingDuplicities(addUsersData)
    if (!userData?.users?.length) return

    onboardingTypeModal.show()
  }

  async function createUserFlow() {
    let emails = userData?.users?.map(x => x.email) || []
    try {
      const res = await users.invite({
        emails: emails,
        builder: false,
        admin: false,
      })
      notifications.success(res.message)
      inviteConfirmationModal.show()
    } catch (error) {
      notifications.error("Error inviting user")
    }
  }

  const removingDuplicities = async userData => {
    const currentUserEmails = (await users.fetch())?.map(x => x.email) || []
    const newUsers = []

    for (const user of userData?.users) {
      const { email } = user

      if (
        newUsers.find(x => x.email === email) ||
        currentUserEmails.includes(email)
      )
        continue

      newUsers.push(user)
    }

    if (!newUsers.length)
      notifications.info("Duplicated! There is no new users to add.")
    return { ...userData, users: newUsers }
  }

  const createUsersFromCsv = async userCsvData => {
    const { userEmails, usersRole, userGroups: groups } = userCsvData

    const users = []
    for (const email of userEmails) {
      const newUser = {
        email: email,
        role: usersRole,
        password: Math.random().toString(36).substring(2, 22),
        forceResetPassword: true,
      }

      users.push(newUser)
    }

    userData = await removingDuplicities({ groups, users })
    if (!userData.users.length) return

    return createUser()
  }

  async function createUser() {
    try {
      await users.create(await removingDuplicities(userData))
      notifications.success("Successfully created user")
      await groups.actions.init()
      passwordModal.show()
    } catch (error) {
      notifications.error("Error creating user")
    }
  }

  async function chooseCreationType(onboardingType) {
    if (onboardingType === "emailOnboarding") {
      createUserFlow()
    } else {
      await createUser()
    }
  }

  onMount(async () => {
    try {
      await groups.actions.init()
    } catch (error) {
      notifications.error("Error fetching User Group data")
    }
  })

  const deleteRows = async () => {
    try {
      let ids = selectedRows.map(user => user._id)
      await users.bulkDelete(ids)
      notifications.success(`Successfully deleted ${selectedRows.length} rows`)
      selectedRows = []
      await fetchUsers(page, searchEmail)
    } catch (error) {
      notifications.error("Error deleting rows")
    }
  }

  async function fetchUsers(page, email) {
    if ($pageInfo.loading) {
      return
    }
    // need to remove the page if they've started searching
    if (email && !prevEmail) {
      pageInfo.reset()
      page = undefined
    }
    prevEmail = email
    try {
      pageInfo.loading()
      await users.search({ page, email })
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

      <div class="field">
        <Label size="L">Search email</Label>
        <Search bind:value={searchEmail} placeholder="" />
      </div>
      {#if selectedRows.length > 0}
        <DeleteRowsButton on:updaterows {selectedRows} {deleteRows} />
      {/if}
    </ButtonGroup>
    <Table
      on:click={({ detail }) => $goto(`./${detail._id}`)}
      {schema}
      bind:selectedRows
      data={enrichedUsers}
      allowEditColumns={false}
      allowEditRows={false}
      allowSelectRows={true}
      showHeaderBorder={false}
      {customRenderers}
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
  <OnboardingTypeModal {chooseCreationType} />
</Modal>

<Modal bind:this={passwordModal}>
  <PasswordModal userData={userData.users} />
</Modal>

<Modal bind:this={importUsersModal}>
  <ImportUsersModal {createUsersFromCsv} />
</Modal>

<style>
  .field {
    display: flex;
    align-items: center;
    flex-direction: row;
    grid-gap: var(--spacing-m);
    margin-left: auto;
  }

  .field > :global(*) + :global(*) {
    margin-left: var(--spacing-m);
  }

  .access-description {
    display: flex;
    margin-top: var(--spacing-xl);
    opacity: 0.8;
  }

  .access-text {
    margin-left: var(--spacing-m);
  }
</style>
