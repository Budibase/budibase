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
    Search,
    Divider,
    Detail,
    notifications,
    List,
    ListItem,
    StatusLight,
  } from "@budibase/bbui"
  import { users, apps, groups } from "stores/portal"
  import { onMount } from "svelte"
  import { RoleUtils } from "@budibase/frontend-core"

  export let groupId
  let popoverAnchor
  let popover
  $: group = $groups.find(x => x._id === groupId)
  let searchTerm = ""
  let selectedUsers = []
  $: filteredUsers = $users.filter(
    user =>
      selectedUsers &&
      user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )
  let app_list = [
    {
      access: "ADMIN",
      name: "test app",
      icon: "Anchor",
      color: "blue",
    },
  ]

  async function addAll() {
    selectedUsers = [...selectedUsers, ...filteredUsers]
    group.users = selectedUsers
    await groups.actions.save(group)
  }

  async function selectUser(id) {
    let selectedUser = selectedUsers.find(user_id => user_id === id)
    let enrichedUser = $users.find(user => user._id === id)
    if (selectedUser) {
      selectedUsers = selectedUsers.filter(id => id !== selectedUser)
      let newUsers = group.users.filter(user => user._id !== id)
      group.users = newUsers
    } else {
      selectedUsers = [...selectedUsers, id]
      group.users.push(enrichedUser)
    }
    await groups.actions.save(group)
  }

  async function removeUser(id) {
    let newUsers = group.users.filter(user => user._id !== id)
    group.users = newUsers
    await groups.actions.save(group)
  }
  onMount(async () => {
    try {
      await groups.actions.init()
      await users.init()
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
      <div style="padding: var(--spacing-m)">
        <Search placeholder="Search" bind:value={searchTerm} />
        <div class="users-header header">
          <div>
            <Detail
              >{filteredUsers.length} User{filteredUsers.length === 1
                ? ""
                : "s"}</Detail
            >
          </div>
          <div>
            <ActionButton on:click={addAll} emphasized size="S"
              >Add all</ActionButton
            >
          </div>
        </div>
        <Divider noMargin />
        <div>
          {#each filteredUsers as user}
            <div
              on:click={selectUser(user._id)}
              style="padding-bottom: var(--spacing-m)"
              class="user-selection"
            >
              <div>
                {user.email}
              </div>

              {#if selectedUsers.includes(user._id)}
                <div>
                  <Icon
                    color="var(--spectrum-global-color-blue-600);"
                    name="Checkmark"
                  />
                </div>
              {/if}
            </div>
          {/each}
        </div>
      </div>
    </Popover>
  </div>

  <List>
    {#if group?.users.length}
      {#each group.users as user}
        <ListItem subtitle={user.access} title={user.email} avatar
          ><Icon
            on:click={() => removeUser(user._id)}
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
    {#if app_list.length}
      {#each app_list as app}
        <ListItem title={app.name} icon={app.icon} iconBackground={app.color}>
          <div class="title ">
            <StatusLight color={RoleUtils.getRoleColour(app.access)} />
            <div style="margin-left: var(--spacing-s);">
              <Body size="XS">{app.access}</Body>
            </div>
          </div>
        </ListItem>
      {/each}
    {:else}
      <ListItem icon="UserGroup" title="You have no users in this team" />
    {/if}
  </List>
</Layout>

<style>
  .text-padding {
    margin-left: var(--spacing-l);
  }

  .users-header {
    align-items: center;
    padding: var(--spacing-m) 0 var(--spacing-m) 0;
    display: flex;
    justify-content: space-between;
  }

  .user-selection {
    align-items: end;
    display: flex;
    justify-content: space-between;
    cursor: pointer;
  }

  .user-selection > :first-child {
    padding-top: var(--spacing-m);
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
