<script>
  import {
    Layout,
    Heading,
    Body,
    Button,
    List,
    ListItem,
    Modal,
    notifications,
    Pagination,
    Icon,
  } from "@budibase/bbui"
  import { onMount } from "svelte"

  import RoleSelect from "components/common/RoleSelect.svelte"
  import { users, groups, apps, licensing } from "stores/portal"
  import AssignmentModal from "./AssignmentModal.svelte"
  import { roles } from "stores/backend"
  import { API } from "api"
  import { fetchData } from "@budibase/frontend-core"

  export let app

  const usersFetch = fetchData({
    API,
    datasource: {
      type: "user",
    },
    options: {
      query: {
        appId: apps.getProdAppID(app.devId),
      },
    },
  })

  let assignmentModal
  let appGroups
  let appUsers

  $: fixedAppId = apps.getProdAppID(app.devId)
  $: appUsers = $usersFetch.rows
  $: appGroups = $groups.filter(group => {
    if (!group.roles) {
      return false
    }
    return groups.actions.getGroupAppIds(group).includes(fixedAppId)
  })

  async function removeUser(user) {
    // Remove the user role
    const filteredRoles = { ...user.roles }
    delete filteredRoles[fixedAppId]
    await users.save({
      ...user,
      roles: {
        ...filteredRoles,
      },
    })
    await usersFetch.refresh()
  }

  async function removeGroup(group) {
    await groups.actions.removeApp(group._id, fixedAppId)
    await groups.actions.init()
    await usersFetch.refresh()
  }

  async function updateUserRole(role, user) {
    user.roles[fixedAppId] = role
    await users.save(user)
  }

  async function updateGroupRole(role, group) {
    await groups.actions.addApp(group._id, fixedAppId, role)
    await usersFetch.refresh()
  }

  onMount(async () => {
    try {
      await roles.fetch()
    } catch (error) {
      notifications.error(error)
    }
  })
</script>

<div class="access-tab">
  <Layout>
    {#if appGroups.length || appUsers.length}
      <div>
        <Heading>Access</Heading>
        <div class="subtitle">
          <Body size="S">
            Assign users and groups to your app and define their access here
          </Body>
          <Button on:click={assignmentModal.show} icon="User" cta>
            Assign access
          </Button>
        </div>
      </div>
      {#if $licensing.groupsEnabled && appGroups.length}
        <List title="User Groups">
          {#each appGroups as group}
            <ListItem
              title={group.name}
              icon={group.icon}
              iconBackground={group.color}
            >
              <RoleSelect
                on:change={e => updateGroupRole(e.detail, group)}
                autoWidth
                quiet
                value={group.roles[
                  groups.actions
                    .getGroupAppIds(group)
                    .find(x => x === fixedAppId)
                ]}
                allowPublic={false}
              />
              <Icon
                on:click={() => removeGroup(group)}
                hoverable
                size="S"
                name="Close"
              />
            </ListItem>
          {/each}
        </List>
      {/if}
      {#if appUsers.length}
        <div>
          <List title="Users">
            {#each appUsers as user}
              <ListItem title={user.email} avatar>
                <RoleSelect
                  on:change={e => updateUserRole(e.detail, user)}
                  autoWidth
                  quiet
                  value={user.roles[
                    Object.keys(user.roles).find(x => x === fixedAppId)
                  ]}
                  allowPublic={false}
                />
                <Icon
                  on:click={() => removeUser(user)}
                  hoverable
                  size="S"
                  name="Close"
                />
              </ListItem>
            {/each}
          </List>
          <div class="pagination">
            <Pagination
              page={$usersFetch.pageNumber + 1}
              hasPrevPage={$usersFetch.hasPrevPage}
              hasNextPage={$usersFetch.hasNextPage}
              goToPrevPage={$usersFetch.loading ? null : fetch.prevPage}
              goToNextPage={$usersFetch.loading ? null : fetch.nextPage}
            />
          </div>
        </div>
      {/if}
    {:else}
      <div class="align">
        <Layout gap="S">
          <Heading>No users assigned</Heading>
          <div class="opacity">
            <Body size="S">
              Assign users/groups to your app and set their access here
            </Body>
          </div>
          <div class="padding">
            <Button
              on:click={() => assignmentModal.show()}
              cta
              icon="UserArrow"
            >
              Assign access
            </Button>
          </div>
        </Layout>
      </div>
    {/if}
  </Layout>
</div>

<Modal bind:this={assignmentModal}>
  <AssignmentModal {app} {appUsers} on:update={usersFetch.refresh} />
</Modal>

<style>
  .access-tab {
    max-width: 600px;
    margin: 0 auto;
    padding: 40px;
  }

  .padding {
    margin-top: var(--spacing-m);
  }
  .opacity {
    opacity: 0.8;
  }

  .align {
    text-align: center;
  }
  .subtitle {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .pagination {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    margin-top: var(--spacing-xl);
  }
</style>
