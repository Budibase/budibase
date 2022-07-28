<script>
  import {
    ModalContent,
    PickerDropdown,
    ActionButton,
    notifications,
  } from "@budibase/bbui"
  import { roles } from "stores/backend"
  import { groups, users } from "stores/portal"
  import { RoleUtils } from "@budibase/frontend-core"
  import { createPaginationStore } from "helpers/pagination"

  export let app
  export let addData
  export let appUsers = []

  let prevSearch = undefined,
    search = undefined
  let pageInfo = createPaginationStore()

  $: page = $pageInfo.page
  $: fetchUsers(page, search)
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

  $: filteredGroups = $groups.filter(element => {
    return !element.apps.find(y => {
      return y.appId === app.appId
    })
  })

  $: optionSections = {
    ...(filteredGroups.length && {
      groups: {
        data: filteredGroups,
        getLabel: group => group.name,
        getValue: group => group._id,
        getIcon: group => group.icon,
        getColour: group => group.color,
      },
    }),
    users: {
      data: $users.data.filter(u => !appUsers.find(x => x._id === u._id)),
      getLabel: user => user.email,
      getValue: user => user._id,
      getIcon: user => user.icon,
      getColour: user => user.color,
    },
  }

  $: appData = [{ id: "", role: "" }]

  function addNewInput() {
    appData = [...appData, { id: "", role: "" }]
  }
</script>

<ModalContent
  size="M"
  title="Assign users to your app"
  confirmText="Done"
  cancelText="Cancel"
  onConfirm={() => addData(appData)}
  showCloseIcon={false}
>
  {#each appData as input, index}
    <PickerDropdown
      autocomplete
      primaryOptions={optionSections}
      placeholder={"Search Users"}
      secondaryOptions={$roles}
      bind:primaryValue={input.id}
      bind:secondaryValue={input.role}
      getPrimaryOptionLabel={group => group.name}
      getPrimaryOptionValue={group => group.name}
      getPrimaryOptionIcon={group => group.icon}
      getPrimaryOptionColour={group => group.colour}
      getSecondaryOptionLabel={role => role.name}
      getSecondaryOptionValue={role => role._id}
      getSecondaryOptionColour={role => RoleUtils.getRoleColour(role._id)}
    />
  {/each}

  <div>
    <ActionButton on:click={addNewInput} icon="Add">Add email</ActionButton>
  </div>
</ModalContent>
