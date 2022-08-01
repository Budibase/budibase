<script>
  import {
    Layout,
    Heading,
    Body,
    Button,
    Modal,
    Tag,
    Tags,
    notifications,
  } from "@budibase/bbui"
  import { groups, auth } from "stores/portal"
  import { onMount } from "svelte"
  import { Constants } from "@budibase/frontend-core"
  import CreateEditGroupModal from "./_components/CreateEditGroupModal.svelte"
  import UserGroupsRow from "./_components/UserGroupsRow.svelte"
  import { cloneDeep } from "lodash/fp"

  const DefaultGroup = {
    name: "",
    icon: "UserGroup",
    color: "var(--spectrum-global-color-blue-600)",
    users: [],
    apps: [],
    roles: {},
  }
  let modal
  let group = cloneDeep(DefaultGroup)

  $: hasGroupsLicense = $auth.user?.license.features.includes(
    Constants.Features.USER_GROUPS
  )

  async function deleteGroup(group) {
    try {
      groups.actions.delete(group)
    } catch (error) {
      notifications.error(`Failed to delete group`)
    }
  }

  async function saveGroup(group) {
    try {
      await groups.actions.save(group)
    } catch (error) {
      notifications.error(`Failed to save group`)
    }
  }

  const showCreateGroupModal = () => {
    group = cloneDeep(DefaultGroup)
    modal?.show()
  }

  onMount(async () => {
    try {
      if (hasGroupsLicense) {
        await groups.actions.init()
      }
    } catch (error) {
      notifications.error("Error getting User groups")
    }
  })
</script>

<Layout noPadding>
  <Layout gap="XS" noPadding>
    <div style="display: flex;">
      <Heading size="M">User groups</Heading>
      {#if !hasGroupsLicense}
        <Tags>
          <div class="tags">
            <div class="tag">
              <Tag icon="LockClosed">Pro plan</Tag>
            </div>
          </div>
        </Tags>
      {/if}
    </div>
    <Body>Easily assign and manage your users access with User Groups</Body>
  </Layout>
  <div class="align-buttons">
    <Button
      newStyles
      icon={hasGroupsLicense ? "UserGroup" : ""}
      cta={hasGroupsLicense}
      on:click={hasGroupsLicense
        ? showCreateGroupModal
        : window.open("https://budibase.com/pricing/", "_blank")}
    >
      {hasGroupsLicense ? "Create user group" : "Upgrade Account"}
    </Button>
    {#if !hasGroupsLicense}
      <Button
        newStyles
        secondary
        on:click={() => {
          window.open("https://budibase.com/pricing/", "_blank")
        }}>View Plans</Button
      >
    {/if}
  </div>

  {#if hasGroupsLicense && $groups.length}
    <div class="groupTable">
      {#each $groups as group}
        <div>
          <UserGroupsRow {saveGroup} {deleteGroup} {group} />
        </div>
      {/each}
    </div>
  {/if}
</Layout>

<Modal bind:this={modal}>
  <CreateEditGroupModal bind:group {saveGroup} />
</Modal>

<style>
  .align-buttons {
    display: flex;
    column-gap: var(--spacing-xl);
  }
  .tag {
    margin-top: var(--spacing-xs);
    margin-left: var(--spacing-m);
  }

  .groupTable {
    display: grid;
    grid-template-rows: auto;
    align-items: center;
    border-bottom: 1px solid var(--spectrum-alias-border-color-mid);
    border-left: 1px solid var(--spectrum-alias-border-color-mid);
    background: var(--spectrum-global-color-gray-50);
  }

  .groupTable :global(> div) {
    background: var(--bg-color);

    height: 55px;
    display: grid;
    align-items: center;
    grid-gap: var(--spacing-xl);
    grid-template-columns: 2fr 2fr 2fr auto;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 0 var(--spacing-s);
    border-top: 1px solid var(--spectrum-alias-border-color-mid);
    border-right: 1px solid var(--spectrum-alias-border-color-mid);
  }
</style>
