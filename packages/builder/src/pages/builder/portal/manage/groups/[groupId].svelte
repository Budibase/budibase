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
  } from "@budibase/bbui"
  import UserRow from "./_components/UserRow.svelte"
  import { users } from "stores/portal"
  import { onMount } from "svelte"

  let popoverAnchor
  let popover
  let searchTerm = ""
  let selectedUsers = []
  $: filteredUsers = $users.filter(user =>
    user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  let group = {
    _id: "gr_123456",
    color: "green",
    icon: "Anchor",
    name: "Core Team",
    userCount: 5,
    appCount: 2,
  }

  let groupUsers = [
    {
      email: "peter@budibase.com",
      access: "Developer",
    },
  ]

  /*
  function getGroup() {
    return 
  }
  */
  function selectUser(id) {
    let user = selectedUsers.find(user_id => user_id === id)
    if (user) {
      selectedUsers = selectedUsers.filter(id => id !== user)
    } else {
      selectedUsers = [...selectedUsers, id]
    }
  }
  onMount(() => {
    console.log($users)
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
      <div style="background: {group.color};" class="circle">
        <div>
          <Icon size="M" name={group.icon} />
        </div>
      </div>
      <div class="text-padding">
        <Heading>{group.name}</Heading>
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
            <ActionButton emphasized size="S">Add all</ActionButton>
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

  <div class="usersTable">
    {#if groupUsers.length}
      {#each groupUsers as user}
        <div>
          <UserRow {user} />
        </div>
      {/each}
    {:else}
      <div>
        <div class="title header text-padding">
          <Icon name="UserGroup" />
          <div class="text-padding">
            <Body size="S">You have no users in this team</Body>
          </div>
        </div>
      </div>
    {/if}
  </div>
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

  .usersTable {
    display: grid;
    grid-template-rows: auto;
    align-items: center;
    border-bottom: 1px solid var(--spectrum-alias-border-color-mid);
    border-left: 1px solid var(--spectrum-alias-border-color-mid);
    background: var(--spectrum-global-color-gray-50);
  }

  .usersTable :global(> div) {
    background: var(--bg-color);

    height: 70px;
    display: grid;
    align-items: center;
    grid-gap: var(--spacing-xl);
    grid-template-columns: 0.1fr 0.6fr 2fr 0.4fr;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 0 var(--spacing-s);
    border-top: 1px solid var(--spectrum-alias-border-color-mid);
    border-right: 1px solid var(--spectrum-alias-border-color-mid);
  }
</style>
