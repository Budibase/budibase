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

  import { users, apps, groups } from "stores/portal"
  import { onMount } from "svelte"
  import { RoleUtils } from "@budibase/frontend-core"

  export let groupId
  let popoverAnchor
  let popover
  let searchTerm = ""
  let selectedUsers = []
  $: group = $groups.find(x => x._id === groupId)
  $: filteredUsers = $users.filter(
    user =>
      selectedUsers &&
      user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )
  $: console.log(group)
  async function addAll() {
    selectedUsers = [...selectedUsers, ...filteredUsers]
    group.users = selectedUsers
    await groups.actions.save(group)
  }

  async function selectUser(id) {
    let selectedUser = selectedUsers.includes(id)
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
      <UserGroupPicker
        key={"email"}
        title={"User"}
        bind:searchTerm
        bind:selected={selectedUsers}
        bind:filtered={filteredUsers}
        {addAll}
        select={selectUser}
      />
    </Popover>
  </div>

  <List>
    {#if group?.users.length}
      {#each group.users as user}
        <ListItem subtitle={user?.access} title={user?.email} avatar
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
    {#if group?.apps}
      {#each group.apps as app}
        <ListItem
          title={app.name}
          icon={app?.icon?.name || "Apps"}
          iconBackground={app?.icon?.color || ""}
        >
          <div class="title ">
            <StatusLight color={RoleUtils.getRoleColour(app.access)} />
            <div style="margin-left: var(--spacing-s);">
              <Body size="XS">{app.access}</Body>
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
