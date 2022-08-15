<script>
  import {
    ModalContent,
    PickerDropdown,
    ActionButton,
    Layout,
    Icon,
    notifications,
  } from "@budibase/bbui"
  import { roles } from "stores/backend"
  import { groups, users, auth } from "stores/portal"
  import { RoleUtils } from "@budibase/frontend-core"
  import { createPaginationStore } from "helpers/pagination"

  export let app
  export let addData
  export let appUsers = []

  let prevSearch = undefined,
    search = undefined
  let pageInfo = createPaginationStore()
  let appData = [{ id: "", role: "" }]

  $: page = $pageInfo.page
  $: fetchUsers(page, search)
  $: availableUsers = getAvailableUsers($users, appUsers, appData)
  $: filteredGroups = $groups.filter(group => {
    return !group.apps.find(appId => {
      return appId === app.appId
    })
  })
  $: valid =
    appData?.length && !appData?.some(x => !x.id?.length || !x.role?.length)
  $: optionSections = {
    ...($auth.groupsEnabled &&
      filteredGroups.length && {
        ["User groups"]: {
          data: filteredGroups,
          getLabel: group => group.name,
          getValue: group => group._id,
          getIcon: group => group.icon,
          getColour: group => group.color,
        },
      }),
    users: {
      data: availableUsers,
      getLabel: user => user.email,
      getValue: user => user._id,
      getIcon: user => user.icon,
      getColour: user => user.color,
    },
  }

  const getAvailableUsers = (allUsers, appUsers, newUsers) => {
    return (allUsers.data || []).filter(user => {
      // Filter out assigned users
      if (appUsers.find(x => x._id === user._id)) {
        return false
      }

      // Filter out new users which are going to be assigned
      return !newUsers.find(x => x.id === user._id)
    })
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
      await users.search({ page, email: search })
      pageInfo.fetched($users.hasNextPage, $users.nextPage)
    } catch (error) {
      notifications.error("Error getting user list")
    }
  }

  function addNewInput() {
    appData = [...appData, { id: "", role: "" }]
  }

  const removeItem = index => {
    appData = appData.filter((x, idx) => idx !== index)
  }
</script>

<ModalContent
  size="M"
  title="Assign users to your app"
  confirmText="Done"
  cancelText="Cancel"
  onConfirm={() => addData(appData)}
  showCloseIcon={false}
  disabled={!valid}
>
  {#if appData?.length}
    <Layout noPadding gap="XS">
      {#each appData as input, index}
        <div class="item">
          <div class="picker">
            <PickerDropdown
              autocomplete
              showClearIcon={false}
              primaryOptions={optionSections}
              secondaryOptions={$roles}
              secondaryPlaceholder="Access"
              bind:primaryValue={input.id}
              bind:secondaryValue={input.role}
              bind:searchTerm={search}
              getPrimaryOptionLabel={group => group.name}
              getPrimaryOptionValue={group => group.name}
              getPrimaryOptionIcon={group => group.icon}
              getPrimaryOptionColour={group => group.colour}
              getSecondaryOptionLabel={role => role.name}
              getSecondaryOptionValue={role => role._id}
              getSecondaryOptionColour={role =>
                RoleUtils.getRoleColour(role._id)}
            />
          </div>
          <div class="icon">
            <Icon
              name="Close"
              hoverable
              size="S"
              on:click={() => removeItem(index)}
            />
          </div>
        </div>
      {/each}
    </Layout>
  {/if}
  <div>
    <ActionButton on:click={addNewInput} icon="Add">Add email</ActionButton>
  </div>
</ModalContent>

<style>
  .item {
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  .picker {
    width: calc(100% - 30px);
  }
  .icon {
    width: 20px;
  }
</style>
