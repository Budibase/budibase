<script>
  import { goto } from "@roxi/routify"
  import {
    ActionButton,
    Button,
    Layout,
    Heading,
    Body,
    Icon,
    Popover,
    notifications,
    List,
    ListItem,
    StatusLight,
  } from "@budibase/bbui"
  import UserGroupPicker from "components/settings/UserGroupPicker.svelte"
  import { createPaginationStore } from "helpers/pagination"
  import { users, apps, groups } from "stores/portal"
  import { onMount } from "svelte"
  import { RoleUtils } from "@budibase/frontend-core"

  export let groupId
  let popoverAnchor
  let popover
  let searchTerm = ""
  let selectedUsers = []
  let prevSearch = undefined,
    search = undefined
  let pageInfo = createPaginationStore()

  $: page = $pageInfo.page
  $: fetchUsers(page, search)
  $: group = $groups.find(x => x._id === groupId)

  async function addAll() {
    group.users = selectedUsers
    await groups.actions.save(group)
  }

  async function selectUser(id) {
    let selectedUser = selectedUsers.includes(id)
    if (selectedUser) {
      selectedUsers = selectedUsers.filter(id => id !== selectedUser)
      let newUsers = group.users.filter(user => user._id !== id)
      group.users = newUsers
    } else {
      let enrichedUser = $users.data
        .filter(user => user._id === id)
        .map(u => {
          return {
            _id: u._id,
            email: u.email,
          }
        })[0]
      selectedUsers = [...selectedUsers, id]
      group.users.push(enrichedUser)
    }

    await groups.actions.save(group)

    let user = await users.get(id)

    let userGroups = user.userGroups || []
    userGroups.push(groupId)
    await users.save({
      ...user,
      userGroups,
    })
  }
  $: filtered =
    $users.data?.filter(x => !group?.users.map(y => y._id).includes(x._id)) ||
    []

  $: groupApps = $apps.filter(x => group.apps.includes(x.appId))
  async function removeUser(id) {
    let newUsers = group.users.filter(user => user._id !== id)
    group.users = newUsers
    let user = await users.get(id)

    await users.save({
      ...user,
      userGroups: [],
    })

    await groups.actions.save(group)
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
      await users.search({ page, search })
      pageInfo.fetched($users.hasNextPage, $users.nextPage)
    } catch (error) {
      notifications.error("Error getting user list")
    }
  }

  onMount(async () => {
    try {
      await groups.actions.init()
      await apps.load()
    } catch (error) {
      notifications.error("Error fetching User Group data")
    }
  })
</script>

<Layout noPadding>
  <div>
    <ActionButton on:click={() => $goto("../groups")} size="S" icon="ArrowLeft">
      Back
    </ActionButton>
  </div>
  <div class="header">
    <div class="title">
      <div style="background: {group?.color};" class="circle">
        <div>
          <Icon size="M" name={group?.icon} />
        </div>
      </div>
      <div class="text-padding">
        <Heading>{group?.name}</Heading>
      </div>
    </div>
    <div bind:this={popoverAnchor}>
      <Button on:click={popover.show()} icon="UserAdd" cta>Add User</Button>
    </div>
    <Popover align="right" bind:this={popover} anchor={popoverAnchor}>
      <UserGroupPicker
        key={"email"}
        title={"User"}
        bind:searchTerm
        bind:selected={selectedUsers}
        bind:filtered
        {addAll}
        select={selectUser}
      />
    </Popover>
  </div>

  <List>
    {#if group?.users.length}
      {#each group.users as user}
        <ListItem title={user?.email} avatar
          ><Icon
            on:click={() => removeUser(user?._id)}
            hoverable
            size="L"
            name="Close"
          /></ListItem
        >
      {/each}
    {:else}
      <ListItem icon="UserGroup" title="You have no users in this team" />
    {/if}
  </List>
  <div
    style="flex-direction: column; margin-top: var(--spacing-m)"
    class="title"
  >
    <Heading weight="light" size="XS">Apps</Heading>
    <div style="margin-top: var(--spacing-xs)">
      <Body size="S">Manage apps that this User group has been assigned to</Body
      >
    </div>
  </div>

  <List>
    {#if groupApps.length}
      {#each groupApps as app}
        <ListItem
          title={app.name}
          icon={app?.icon?.name || "Apps"}
          iconBackground={app?.icon?.color || ""}
        >
          <div class="title ">
            <StatusLight
              color={RoleUtils.getRoleColour(group.roles[app.appId])}
            />
            <div style="margin-left: var(--spacing-s);">
              <Body size="XS">{group.roles[app.appId]}</Body>
            </div>
          </div>
        </ListItem>
      {/each}
    {:else}
      <ListItem icon="UserGroup" title="No apps" />
    {/if}
  </List>
</Layout>

<style>
  .text-padding {
    margin-left: var(--spacing-l);
  }

  .header {
    display: flex;
    justify-content: space-between;
  }
  .title {
    display: flex;
  }
  .circle {
    border-radius: 50%;
    height: 30px;
    color: white;
    font-weight: bold;
    display: inline-block;
    font-size: 1.2em;
    width: 30px;
  }

  .circle > div {
    padding: calc(1.5 * var(--spacing-xs)) var(--spacing-xs);
  }
</style>
