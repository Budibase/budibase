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
  import { users, groups, apps, auth } from "stores/portal"
  import AssignmentModal from "./AssignmentModal.svelte"
  import { createPaginationStore } from "helpers/pagination"
  import { Constants } from "@budibase/frontend-core"
  import { roles } from "stores/backend"

  export let app
  let assignmentModal
  let appGroups = []
  let appUsers = []
  let prevSearch = undefined,
    search = undefined
  let pageInfo = createPaginationStore()
  let fixedAppId
  $: page = $pageInfo.page

  $: hasGroupsLicense = $auth.user?.license.features.includes(
    Constants.Features.USER_GROUPS
  )

  $: fixedAppId = apps.getProdAppID(app.devId)

  $: appGroups = $groups.filter(x => {
    return x.apps.includes(app.appId)
  })

  async function addData(appData) {
    let gr_prefix = "gr"
    let us_prefix = "us"
    appData.forEach(async data => {
      if (data.id.startsWith(gr_prefix)) {
        let matchedGroup = $groups.find(group => {
          return group._id === data.id
        })
        matchedGroup.apps.push(app.appId)
        matchedGroup.roles[fixedAppId] = data.role

        groups.actions.save(matchedGroup)
      } else if (data.id.startsWith(us_prefix)) {
        let matchedUser = $users.data.find(user => {
          return user._id === data.id
        })

        let newUser = {
          ...matchedUser,
          roles: { [fixedAppId]: data.role, ...matchedUser.roles },
        }

        await users.save(newUser, { opts: { appId: fixedAppId } })
        await fetchUsers(page, search)
      }
    })
    await groups.actions.init()
  }

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
    await fetchUsers(page, search)
  }

  async function removeGroup(group) {
    // Remove the user role
    let filteredApps = group.apps.filter(
      x => apps.extractAppId(x) !== app.appId
    )
    const filteredRoles = { ...group.roles }
    delete filteredRoles[fixedAppId]

    await groups.actions.save({
      ...group,
      apps: filteredApps,
      roles: { ...filteredRoles },
    })

    await fetchUsers(page, search)
  }

  async function updateUserRole(role, user) {
    user.roles[fixedAppId] = role
    users.save(user)
  }

  async function updateGroupRole(role, group) {
    group.roles[fixedAppId] = role
    groups.actions.save(group)
  }

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
      await users.search({ page, appId: fixedAppId })
      pageInfo.fetched($users.hasNextPage, $users.nextPage)
      appUsers =
        $users.data?.filter(x => {
          return Object.keys(x.roles).find(y => {
            return y === fixedAppId
          })
        }) || []
    } catch (error) {
      notifications.error("Error getting user list")
    }
  }

  onMount(async () => {
    try {
      await fetchUsers(page, search)

      await groups.actions.init()
      await apps.load()
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
            Assign users to your app and define their access here</Body
          >
          <Button on:click={assignmentModal.show} icon="User" cta
            >Assign users</Button
          >
        </div>
      </div>
      {#if hasGroupsLicense && appGroups.length}
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
                  Object.keys(group.roles).find(x => x === fixedAppId)
                ]}
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
            page={$pageInfo.pageNumber}
            hasPrevPage={$pageInfo.loading ? false : $pageInfo.hasPrevPage}
            hasNextPage={$pageInfo.loading ? false : $pageInfo.hasNextPage}
            goToPrevPage={async () => {
              await pageInfo.prevPage()
              fetchUsers(page, search)
            }}
            goToNextPage={async () => {
              await pageInfo.nextPage()
              fetchUsers(page, search)
            }}
          />
        </div>
      {/if}
    {:else}
      <div class="align">
        <Layout gap="S">
          <Heading>No users assigned</Heading>
          <div class="opacity">
            <Body size="S"
              >Assign users to your app and set their access here</Body
            >
          </div>
          <div class="padding">
            <Button on:click={() => assignmentModal.show()} cta icon="UserArrow"
              >Assign Users</Button
            >
          </div>
        </Layout>
      </div>
    {/if}
  </Layout>
</div>

<Modal bind:this={assignmentModal}>
  <AssignmentModal {app} {appUsers} {addData} />
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
