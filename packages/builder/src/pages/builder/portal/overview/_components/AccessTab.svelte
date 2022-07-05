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
  } from "@budibase/bbui"
  import { onMount } from "svelte"

  import RoleSelect from "components/common/RoleSelect.svelte"
  import { users, groups, apps } from "stores/portal"
  import AssignmentModal from "./AssignmentModal.svelte"

  export let app

  let assignmentModal
  let appGroups = []
  let appUsers = []

  $: appUsers = $users.filter(x => {
    return Object.keys(x.roles).some(y => {
      return extractAppId(y) === extractAppId(app.appId)
    })
  })
  $: appGroups = $groups.filter(x => {
    return x.apps.find(y => {
      return y.appId === app.appId
    })
  })
  function extractAppId(id) {
    const split = id?.split("_") || []
    return split.length ? split[split.length - 1] : null
  }

  async function addData(appData) {
    let gr_prefix = "gr"
    let us_prefix = "us"
    appData.forEach(async data => {
      if (data.id.startsWith(gr_prefix)) {
        let matchedGroup = $groups.find(group => {
          return group._id === data.id
        })
        matchedGroup.apps.push(app)

        groups.actions.save(matchedGroup)
      } else if (data.id.startsWith(us_prefix)) {
        let matchedUser = $users.find(user => {
          return user._id === data.id
        })

        let newUser = {
          ...matchedUser,
          roles: { [app.appId]: data.role },
        }

        await users.save(newUser)
      }
    })
  }
  onMount(async () => {
    try {
      await users.init()
      await groups.actions.init()
      await apps.load()
    } catch (error) {
      notifications.error("Error")
    }
  })
</script>

<div class="access-tab">
  <Layout>
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
    <List title="User Groups">
      {#each appGroups as group}
        <ListItem
          title={group.name}
          icon={group.icon}
          iconBackground={group.color}
        >
          <RoleSelect autoWidth quiet value={group.role} />
        </ListItem>
      {/each}
    </List>
    <List title="Users">
      {#each appUsers as user}
        <ListItem title={user.email} avatar>
          <RoleSelect
            autoWidth
            quiet
            value={user.roles[
              Object.keys(user.roles).find(
                x => extractAppId(x) === extractAppId(app.appId)
              )
            ]}
          />
        </ListItem>
      {/each}
    </List>
  </Layout>
</div>

<Modal bind:this={assignmentModal}>
  <AssignmentModal {addData} />
</Modal>

<style>
  .access-tab {
    max-width: 600px;
    margin: 0 auto;
    padding: 40px;
  }
  .subtitle {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
</style>
