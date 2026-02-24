<script>
  import { Button, Popover, notifications } from "@budibase/bbui"
  import UserGroupPicker from "@/components/settings/UserGroupPicker.svelte"
  import { appsStore } from "@/stores/portal/apps"
  import { groups } from "@/stores/portal/groups"
  import { Constants } from "@budibase/frontend-core"

  export let groupId

  let popoverAnchor
  let popover
  let searchTerm = ""

  $: group = $groups.find(x => x._id === groupId)
  $: appList = Object.values(
    $appsStore.apps.reduce((acc, app) => {
      const appId = appsStore.getProdAppID(app.devId)
      if (!acc[appId]) {
        acc[appId] = { _id: appId, name: app.name }
      }
      return acc
    }, {})
  )
  $: selectedApps = groups.getGroupAppIds(group)

  const assignWorkspace = async appId => {
    try {
      await groups.addApp(groupId, appId, Constants.Roles.BASIC)
    } catch (error) {
      notifications.error("Error assigning workspace")
    }
  }

  const unassignWorkspace = async appId => {
    try {
      await groups.removeApp(groupId, appId)
    } catch (error) {
      notifications.error("Error removing workspace")
    }
  }
</script>

<div bind:this={popoverAnchor}>
  <Button on:click={() => popover?.show()} cta>Assign workspace</Button>
</div>
<Popover align="left" bind:this={popover} anchor={popoverAnchor}>
  <UserGroupPicker
    bind:searchTerm
    labelKey="name"
    selected={selectedApps}
    list={appList}
    on:select={async e => {
      await assignWorkspace(e.detail)
    }}
    on:deselect={async e => {
      await unassignWorkspace(e.detail)
    }}
  />
</Popover>
