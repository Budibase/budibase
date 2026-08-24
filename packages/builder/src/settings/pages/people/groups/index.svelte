<script lang="ts">
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
  import GroupWorkspacesTableRenderer from "./_components/GroupWorkspacesTableRenderer.svelte"
  import UsersTableRenderer from "./_components/UsersTableRenderer.svelte"
  import GroupNameTableRenderer from "./_components/GroupNameTableRenderer.svelte"
  import { sdk } from "@budibase/shared-core"
  import { bb } from "@/stores/bb"
  import RouteActions from "@/settings/components/RouteActions.svelte"
  import LockedFeature from "@/pages/builder/_components/LockedFeature.svelte"
  import type { UserGroup } from "@budibase/types"

  const DefaultGroup: UserGroup = {
    name: "",
    icon: "users",
    color: "var(--spectrum-global-color-blue-600)",
    isDefault: false,
    users: [],
    roles: {},
  }

  let modal = $state<Modal>()
  let searchString = $state("")
  let group = $state(cloneDeep(DefaultGroup))
  const customRenderers = [
    { column: "name", component: GroupNameTableRenderer },
    { column: "users", component: UsersTableRenderer },
    { column: "roles", component: GroupWorkspacesTableRenderer },
  ]

  const readonly = $derived(!sdk.users.isAdmin($auth.user))
  const schema = $derived({
    name: { displayName: "Group", width: "2fr", minWidth: "200px" },
    users: { sortable: false, width: "1fr" },
    roles: { sortable: false, displayName: "Workspaces", width: "1fr" },
  })

  const filterGroups = ({
    allGroups,
    search,
  }: {
    allGroups: UserGroup[]
    search: string
  }) => {
    if (!search) {
      return allGroups
    }
    const normalizedSearch = search.toLocaleLowerCase()
    return allGroups.filter(group => {
      return group.name?.toLowerCase().includes(normalizedSearch)
    })
  }

  const filteredGroups = $derived(
    filterGroups({ allGroups: $groups, search: searchString })
  )

  const saveGroup = async (groupToSave: UserGroup) => {
    try {
      group = await groups.save(groupToSave)
      bb.settings(`/people/groups/${group._id}/`)
      notifications.success(`User group created successfully`)
    } catch (error: any) {
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
      <RouteActions>
        <div class="controls">
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
      </RouteActions>
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
  <CreateEditGroupModal {group} {saveGroup} />
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
