<script>
  import {
    ModalContent,
    PickerDropdown,
    ActionButton,
    Layout,
    Icon,
  } from "@budibase/bbui"
  import { roles } from "stores/backend"
  import { groups, users, licensing, apps } from "stores/portal"
  import { Constants, RoleUtils, fetchData } from "@budibase/frontend-core"
  import { API } from "api"
  import { createEventDispatcher } from "svelte"

  export let app
  export let appUsers = []
  export let showUsers = false
  export let showGroups = false

  const dispatch = createEventDispatcher()
  const usersFetch = fetchData({
    API,
    datasource: {
      type: "user",
    },
    options: {
      query: {
        email: "",
      },
    },
  })

  let search = ""
  let data = [{ id: "", role: "" }]

  $: usersFetch.update({
    query: {
      email: search,
    },
  })
  $: fixedAppId = apps.getProdAppID(app.devId)
  $: availableUsers = getAvailableUsers($usersFetch.rows, appUsers, data)
  $: availableGroups = getAvailableGroups($groups, app.appId, search, data)
  $: valid = data?.length && !data?.some(x => !x.id?.length || !x.role?.length)
  $: optionSections = {
    ...(showGroups &&
      $licensing.groupsEnabled &&
      availableGroups.length && {
        ["User groups"]: {
          data: availableGroups,
          getLabel: group => group.name,
          getValue: group => group._id,
          getIcon: group => group.icon,
          getColour: group => group.color,
        },
      }),
    ...(showUsers && {
      users: {
        data: availableUsers,
        getLabel: user => user.email,
        getValue: user => user._id,
        getIcon: user => user.icon,
        getColour: user => user.color,
      },
    }),
  }

  const addData = async appData => {
    const gr_prefix = "gr"
    const us_prefix = "us"
    for (let data of appData) {
      // Assign group
      if (data.id.startsWith(gr_prefix)) {
        const group = $groups.find(group => {
          return group._id === data.id
        })
        if (!group) {
          continue
        }
        await groups.actions.addApp(group._id, fixedAppId, data.role)
      }
      // Assign user
      else if (data.id.startsWith(us_prefix)) {
        const user = await users.get(data.id)
        await users.save({
          ...user,
          roles: {
            ...user.roles,
            [fixedAppId]: data.role,
          },
        })
      }
    }

    // Refresh data when completed
    await usersFetch.refresh()
    dispatch("update")
  }

  const getAvailableUsers = (allUsers, appUsers, newUsers) => {
    return (allUsers || []).filter(user => {
      // Filter out admin users
      if (user?.admin?.global || user?.builder?.global) {
        return false
      }

      // Filter out assigned users
      if (appUsers.find(x => x._id === user._id)) {
        return false
      }

      // Filter out new users which are going to be assigned
      return !newUsers.find(x => x.id === user._id)
    })
  }

  const getAvailableGroups = (allGroups, appId, search, newGroups) => {
    search = search?.toLowerCase()
    return (allGroups || []).filter(group => {
      // Filter out assigned groups
      const appIds = groups.actions.getGroupAppIds(group)
      if (appIds.includes(apps.getProdAppID(appId))) {
        return false
      }

      // Filter out new groups which are going to be assigned
      if (newGroups.find(x => x.id === group._id)) {
        return false
      }

      // Match search string
      return !search || group.name.toLowerCase().includes(search)
    })
  }

  function addNewInput() {
    data = [...data, { id: "", role: "" }]
  }

  const removeItem = index => {
    data = data.filter((x, idx) => idx !== index)
  }
</script>

<ModalContent
  size="M"
  title="Assign access to your app"
  confirmText="Done"
  cancelText="Cancel"
  onConfirm={() => addData(data)}
  showCloseIcon={false}
  disabled={!valid}
>
  {#if data.length}
    <Layout noPadding gap="XS">
      {#each data as input, index}
        <div class="item">
          <div class="picker">
            <PickerDropdown
              autocomplete
              showClearIcon={false}
              primaryOptions={optionSections}
              secondaryOptions={$roles.filter(
                x => x._id !== Constants.Roles.PUBLIC
              )}
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
    <ActionButton on:click={addNewInput} icon="Add">Add more</ActionButton>
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
