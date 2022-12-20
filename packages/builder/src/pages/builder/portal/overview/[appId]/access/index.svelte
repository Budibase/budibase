<script>
  import {
    Layout,
    Heading,
    Body,
    Button,
    Modal,
    notifications,
    Pagination,
    Divider,
    Table,
  } from "@budibase/bbui"
  import { onMount, setContext } from "svelte"
  import { users, groups, apps, licensing, overview } from "stores/portal"
  import AssignmentModal from "./_components/AssignmentModal.svelte"
  import { roles } from "stores/backend"
  import { API } from "api"
  import { fetchData } from "@budibase/frontend-core"
  import UserRoleRenderer from "./_components/UserRoleRenderer.svelte"
  import GroupRoleRenderer from "./_components/GroupRoleRenderer.svelte"

  const userSchema = {
    email: {
      type: "string",
      width: "1fr",
    },
    userAppRole: {
      displayName: "Access",
      width: "150px",
      borderLeft: true,
    },
  }
  const groupSchema = {
    name: {
      type: "string",
      width: "1fr",
    },
    groupAppRole: {
      displayName: "Access",
      width: "150px",
      borderLeft: true,
    },
  }
  const customRenderers = [
    {
      column: "userAppRole",
      component: UserRoleRenderer,
    },
    {
      column: "groupAppRole",
      component: GroupRoleRenderer,
    },
  ]

  let assignmentModal
  let appGroups
  let appUsers

  $: app = $overview.selectedApp
  $: devAppId = app.devId
  $: prodAppId = apps.getProdAppID(app.devId)
  $: usersFetch = fetchData({
    API,
    datasource: {
      type: "user",
    },
    options: {
      query: {
        appId: apps.getProdAppID(devAppId),
      },
    },
  })
  $: appUsers = getAppUsers($usersFetch.rows, prodAppId)
  $: appGroups = getAppGroups($groups, prodAppId)

  const getAppUsers = (users, appId) => {
    return users.map(user => ({
      ...user,
      userAppRole: user.roles[Object.keys(user.roles).find(x => x === appId)],
    }))
  }

  const getAppGroups = (allGroups, appId) => {
    return allGroups
      .filter(group => {
        if (!group.roles) {
          return false
        }
        return groups.actions.getGroupAppIds(group).includes(appId)
      })
      .map(group => ({
        ...group,
        groupAppRole:
          group.roles[
            groups.actions.getGroupAppIds(group).find(x => x === appId)
          ],
      }))
  }

  const updateUserRole = async (role, userId) => {
    const user = $usersFetch.rows.find(user => user._id === userId)
    if (!user) {
      return
    }
    user.roles[prodAppId] = role
    await users.save(user)
    await usersFetch.refresh()
  }

  const removeUserRole = async userId => {
    const user = $usersFetch.rows.find(user => user._id === userId)
    if (!user) {
      return
    }
    const filteredRoles = { ...user.roles }
    delete filteredRoles[prodAppId]
    await users.save({
      ...user,
      roles: {
        ...filteredRoles,
      },
    })
    await usersFetch.refresh()
  }

  const updateGroupRole = async (role, groupId) => {
    const group = $groups.find(group => group._id === groupId)
    if (!group) {
      return
    }
    await groups.actions.addApp(group._id, prodAppId, role)
    await usersFetch.refresh()
  }

  const removeGroupRole = async groupId => {
    const group = $groups.find(group => group._id === groupId)
    if (!group) {
      return
    }
    await groups.actions.removeApp(group._id, prodAppId)
    await usersFetch.refresh()
  }

  setContext("roles", {
    updateUserRole,
    removeUserRole,
    updateGroupRole,
    removeGroupRole,
  })

  onMount(async () => {
    try {
      await roles.fetch()
    } catch (error) {
      notifications.error(error)
    }
  })
</script>

<Layout noPadding>
  <Layout gap="XS" noPadding>
    <Heading>Access</Heading>
    <Body>Assign users to your app and set their access</Body>
  </Layout>
  <Divider />
  <Layout noPadding gap="L">
    {#if $usersFetch.loaded}
      <Layout noPadding gap="S">
        <div class="title">
          <Heading size="S">Users</Heading>
          <Button secondary on:click={assignmentModal.show}>Assign user</Button>
        </div>
        <Table
          customPlaceholder
          data={appUsers}
          schema={userSchema}
          allowEditRows={false}
          {customRenderers}
        >
          <div class="placeholder" slot="placeholder">
            <Heading size="S">You have no users assigned yet</Heading>
          </div>
        </Table>
        {#if $usersFetch.hasPrevPage || $usersFetch.hasNextPage}
          <div class="pagination">
            <Pagination
              page={$usersFetch.pageNumber + 1}
              hasPrevPage={$usersFetch.hasPrevPage}
              hasNextPage={$usersFetch.hasNextPage}
              goToPrevPage={$usersFetch.loading ? null : usersFetch.prevPage}
              goToNextPage={$usersFetch.loading ? null : usersFetch.nextPage}
            />
          </div>
        {/if}
      </Layout>
    {/if}

    {#if $usersFetch.loaded && $licensing.groupsEnabled && appGroups.length}
      <Layout noPadding gap="S">
        <div class="title">
          <Heading size="S">Groups</Heading>
          <Button secondary on:click={assignmentModal.show}>
            Assign group
          </Button>
        </div>
        <Table
          customPlaceholder
          data={appGroups}
          schema={groupSchema}
          allowEditRows={false}
          {customRenderers}
        >
          <div class="placeholder" slot="placeholder">
            <Heading size="S">You have no groups assigned yet</Heading>
          </div>
        </Table>
      </Layout>
    {/if}
  </Layout>
</Layout>

<Modal bind:this={assignmentModal}>
  <AssignmentModal {app} {appUsers} on:update={usersFetch.refresh} />
</Modal>

<style>
  .title {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-end;
  }
  .placeholder {
    flex: 1 1 auto;
    display: grid;
    place-items: center;
    text-align: center;
  }
  .pagination {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    margin-top: calc(-1 * var(--spacing-s));
  }
</style>
