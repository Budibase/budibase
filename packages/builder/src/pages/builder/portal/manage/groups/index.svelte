<script>
  import {
    Layout,
    Heading,
    ColorPicker,
    Body,
    Button,
    Modal,
    ModalContent,
    Input,
    Tag,
    Tags,
    IconPicker,
  } from "@budibase/bbui"
  import { API } from "api"
  import { groups } from "stores/portal"
  import { onMount } from "svelte"

  import UserGroupsRow from "./_components/UserGroupsRow.svelte"

  let modal
  let selectedColor
  let selectedIcon
  let groupName
  let proPlan = true

  async function saveConfig() {
    try {
      API.saveGroup({
        color: selectedColor,
        icon: selectedIcon,
        name: groupName,
      })
    } catch (error) {
      notifications.error(`Failed to save group`)
    }
  }

  onMount(async () => {
    try {
      await groups.init()
    } catch (error) {
      notifications.error("Error getting User groups")
    }
  })
</script>

<Layout noPadding>
  <Layout gap="XS" noPadding>
    <div style="display: flex;">
      <Heading size="M">User groups</Heading>
      {#if !proPlan}
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
      icon={proPlan ? "UserGroup" : ""}
      cta={proPlan}
      on:click={() => modal.show()}
      >{proPlan ? "Create user group" : "Upgrade Account"}</Button
    >
    {#if !proPlan}
      <Button
        secondary
        on:click={() => {
          window.open("https://budibase.com/pricing/", "_blank")
        }}>View Plans</Button
      >
    {/if}
  </div>

  <div class="groupTable">
    {#each $groups as group}
      <div>
        <UserGroupsRow {group} />
      </div>
    {/each}
  </div>
</Layout>

<Modal bind:this={modal}>
  <ModalContent
    onConfirm={saveConfig}
    size="M"
    title="Create User Group"
    confirmText="Save"
  >
    <Input bind:value={groupName} label="Team name" />
    <div class="modal-format">
      <div class="modal-inner">
        <Body size="XS">Icon</Body>
        <div class="modal-spacing">
          <IconPicker bind:value={selectedIcon} />
        </div>
      </div>
      <div class="modal-inner">
        <Body size="XS">Color</Body>
        <div class="modal-spacing">
          <ColorPicker
            bind:value={selectedColor}
            on:change={e => (selectedColor = e.detail)}
          />
        </div>
      </div>
    </div>
  </ModalContent>
</Modal>

<style>
  .modal-format {
    display: flex;
    justify-content: space-between;
    width: 40%;
  }

  .modal-inner {
    display: flex;
    align-items: center;
  }

  .modal-spacing {
    margin-left: var(--spacing-l);
  }

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

    height: 70px;
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
