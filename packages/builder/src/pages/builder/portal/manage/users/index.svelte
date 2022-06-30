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
    notifications,
    Pagination,
  } from "@budibase/bbui"
  import TagsRenderer from "./_components/TagsTableRenderer.svelte"
  import AddUserModal from "./_components/AddUserModal.svelte"
  import { users } from "stores/portal"
  import { createPaginationStore } from "helpers/pagination"

  const schema = {
    email: {},
    developmentAccess: { displayName: "Development Access", type: "boolean" },
    adminAccess: { displayName: "Admin Access", type: "boolean" },
    group: {},
  }

  let pageInfo = createPaginationStore()
  let search = undefined
  $: page = $pageInfo.page
  $: fetchUsers(page, search)

  let createUserModal

  async function fetchUsers(page, search) {
    try {
      await users.fetch({ page, search })
      pageInfo.fetched($users.hasNextPage, $users.nextPage)
    } catch (error) {
      notifications.error("Error getting user list")
    }
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
        <Button primary dataCy="add-user" on:click={createUserModal.show}
          >Add user</Button
        >
      </ButtonGroup>
    </div>
    <div class="field">
      <Label size="L">Search / filter</Label>
      <Search bind:value={search} placeholder="" />
    </div>
    <Table
      on:click={({ detail }) => $goto(`./${detail._id}`)}
      {schema}
      data={$users.data}
      allowEditColumns={false}
      allowEditRows={false}
      allowSelectRows={false}
      customRenderers={[{ column: "group", component: TagsRenderer }]}
    />
    <div class="pagination">
      <Pagination
        page={$pageInfo.pageNumber}
        hasPrevPage={$pageInfo.hasPrevPage}
        hasNextPage={$pageInfo.hasNextPage}
        goToPrevPage={pageInfo.prevPage}
        goToNextPage={pageInfo.nextPage}
      />
    </div>
  </Layout>
</Layout>

<Modal bind:this={createUserModal}>
  <AddUserModal
    on:created={async () => {
      pageInfo.reset()
      await fetchUsers()
    }}
  />
</Modal>

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
