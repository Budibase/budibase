<script>
  import {
    Layout,
    Button,
    Modal,
    Table,
    Search,
    notifications,
  } from "@budibase/bbui"
  import { groups } from "@/stores/portal/groups"
  import { auth } from "@/stores/portal/auth"
  import { licensing } from "@/stores/portal/licensing"
  import { onMount } from "svelte"
  import CreateEditGroupModal from "./_components/CreateEditGroupModal.svelte"
  import { cloneDeep } from "lodash/fp"
  import GroupAppsTableRenderer from "./_components/GroupAppsTableRenderer.svelte"
  import UsersTableRenderer from "./_components/UsersTableRenderer.svelte"
  import GroupNameTableRenderer from "./_components/GroupNameTableRenderer.svelte"
  import { sdk } from "@budibase/shared-core"
  import { bb } from "@/stores/bb"
  import { routeActions } from "@/settings/pages"
  import LockedFeature from "@/pages/builder/portal/_components/LockedFeature.svelte"

  const DefaultGroup = {
    name: "",
    icon: "users",
    color: "var(--spectrum-global-color-blue-600)",
    users: [],
    roles: {},
  }

  let modal
  let searchString
  let group = cloneDeep(DefaultGroup)
  let customRenderers = [
    { column: "name", component: GroupNameTableRenderer },
    { column: "users", component: UsersTableRenderer },
    { column: "roles", component: GroupAppsTableRenderer },
  ]

  $: readonly = !sdk.users.isAdmin($auth.user)
  $: schema = {
    name: { displayName: "Group", width: "2fr", minWidth: "200px" },
    users: { sortable: false, width: "1fr" },
    roles: { sortable: false, displayName: "Workspaces", width: "1fr" },
  }
  $: filteredGroups = filterGroups($groups, searchString)

  const filterGroups = (groups, searchString) => {
    if (!searchString) {
      return groups
    }
    searchString = searchString.toLocaleLowerCase()
    return groups?.filter(group => {
      return group.name?.toLowerCase().includes(searchString)
    })
  }

  async function saveGroup(group) {
    try {
      group = await groups.save(group)
      bb.settings(`/people/groups/${group._id}/`)
      notifications.success(`User group created successfully`)
    } catch (error) {
      if (error.status === 400) {
        notifications.error(error.message)
      } else if (error.message) {
        notifications.error(error.message)
      } else {
        notifications.error(`Failed to save group`)
      }
    }
  }

  const showCreateGroupModal = () => {
    group = cloneDeep(DefaultGroup)
    modal?.show()
  }

  onMount(async () => {
    try {
      // always load latest
      await licensing.init()
      await groups.init()
    } catch (error) {
      notifications.error("Error getting user groups")
    }
  })
</script>

<LockedFeature
  planType={"Enterprise"}
  enabled={$licensing.groupsEnabled}
  title={"Groups"}
  description={"Easily assign and manage your users' access with groups"}
  upgradeButtonClick={async () => {
    licensing.goToUpgradePage()
  }}
>
  <Layout noPadding gap="S">
    {#if $licensing.groupsEnabled}
      <div use:routeActions class="controls">
        <Search bind:value={searchString} placeholder="Search" />
        {#if $licensing.groupsEnabled}
          <!--Show the group create button-->
          <Button
            disabled={readonly}
            size={"M"}
            cta
            on:click={showCreateGroupModal}
          >
            Add group
          </Button>
        {/if}
      </div>
    {/if}

    {#if $licensing.groupsEnabled}
      <Table
        on:click={({ detail }) => {
          bb.settings(`/people/groups/${detail._id}`)
        }}
        {schema}
        data={filteredGroups}
        allowEditColumns={false}
        allowEditRows={false}
        {customRenderers}
      />
    {/if}
  </Layout>
</LockedFeature>

<Modal bind:this={modal}>
  <CreateEditGroupModal bind:group {saveGroup} />
</Modal>

<style>
  .controls {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: var(--spacing-xl);
  }
  .controls :global(.spectrum-Search) {
    width: 200px;
  }
</style>
