<script>
  import {
    Layout,
    Heading,
    Body,
    Button,
    ButtonGroup,
    Modal,
    Tag,
    Tags,
    Table,
    Divider,
    Search,
    notifications,
  } from "@budibase/bbui"
  import { groups, auth, licensing, admin, features } from "stores/portal"
  import { onMount } from "svelte"
  import CreateEditGroupModal from "./_components/CreateEditGroupModal.svelte"
  import { cloneDeep } from "lodash/fp"
  import GroupAppsTableRenderer from "./_components/GroupAppsTableRenderer.svelte"
  import UsersTableRenderer from "./_components/UsersTableRenderer.svelte"
  import GroupNameTableRenderer from "./_components/GroupNameTableRenderer.svelte"
  import { goto } from "@roxi/routify"
  import ScimBanner from "../_components/SCIMBanner.svelte"
  import { sdk } from "@budibase/shared-core"

  const DefaultGroup = {
    name: "",
    icon: "UserGroup",
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
    roles: { sortable: false, displayName: "Apps", width: "1fr" },
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
      group = await groups.actions.save(group)
      $goto(`./${group._id}`)
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
      await groups.actions.init()
    } catch (error) {
      notifications.error("Error getting user groups")
    }
  })
</script>

<Layout noPadding gap="M">
  <Layout gap="XS" noPadding>
    <div class="title">
      <Heading size="M">Groups</Heading>
      {#if !$licensing.groupsEnabled}
        <Tags>
          <Tag icon="LockClosed">Business</Tag>
        </Tags>
      {/if}
    </div>
    <Body>Easily assign and manage your users' access with groups</Body>
  </Layout>
  <Divider />
  {#if !$auth.accountPortalAccess && !$licensing.groupsEnabled && $admin.cloud}
    <Body>Contact your account holder to upgrade your plan.</Body>
  {/if}
  <div class="controls">
    <ButtonGroup>
      {#if $licensing.groupsEnabled}
        {#if !$features.isScimEnabled}
          <!--Show the group create button-->
          <Button disabled={readonly} cta on:click={showCreateGroupModal}>
            Add group
          </Button>
        {:else}
          <ScimBanner />
        {/if}
      {:else}
        <Button
          primary
          disabled={!$auth.accountPortalAccess && $admin.cloud}
          on:click={$licensing.goToUpgradePage()}
        >
          Upgrade
        </Button>
        <!--Show the view plans button-->
        <Button
          secondary
          on:click={() => {
            window.open("https://budibase.com/pricing/", "_blank")
          }}
        >
          View Plans
        </Button>
      {/if}
    </ButtonGroup>
    {#if $licensing.groupsEnabled}
      <div class="controls-right">
        <Search bind:value={searchString} placeholder="Search" />
      </div>
    {/if}
  </div>
  {#if $licensing.groupsEnabled}
    <Table
      on:click={({ detail }) => $goto(`./${detail._id}`)}
      {schema}
      data={filteredGroups}
      allowEditColumns={false}
      allowEditRows={false}
      {customRenderers}
    />
  {/if}
</Layout>

<Modal bind:this={modal}>
  <CreateEditGroupModal bind:group {saveGroup} />
</Modal>

<style>
  .controls {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  .controls-right {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    gap: var(--spacing-xl);
  }
  .controls-right :global(.spectrum-Search) {
    width: 200px;
  }
  .title {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: var(--spacing-m);
  }
</style>
