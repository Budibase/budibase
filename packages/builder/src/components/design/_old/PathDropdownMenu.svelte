<script>
  import { goto } from "@roxi/routify"
  import { store } from "builderStore"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"
  import {
    ActionMenu,
    MenuItem,
    Icon,
    Layout,
    notifications,
  } from "@budibase/bbui"
  import { get } from "svelte/store"

  export let path
  export let screens

  let confirmDeleteDialog

  const deleteScreens = async () => {
    if (!screens?.length) {
      return
    }
    try {
      for (let { id } of screens) {
        // We have to fetch the screen to be deleted immediately before deleting
        // as otherwise we're very likely to 409
        const screen = get(store).screens.find(screen => screen._id === id)
        if (!screen) {
          continue
        }
        await store.actions.screens.delete(screen)
      }
      notifications.success("Screens deleted successfully")
      $goto("../")
    } catch (error) {
      notifications.error("Error deleting screens")
    }
  }
</script>

<ActionMenu>
  <div slot="control" class="icon">
    <Icon size="S" hoverable name="MoreSmallList" />
  </div>
  <MenuItem icon="Delete" on:click={confirmDeleteDialog.show}>
    Delete all screens
  </MenuItem>
</ActionMenu>

<ConfirmDialog
  bind:this={confirmDeleteDialog}
  title="Confirm Deletion"
  okText="Delete screens"
  onOk={deleteScreens}
>
  <Layout noPadding gap="S">
    <div>
      Are you sure you want to delete all screens under the <b>{path}</b> route?
    </div>
    <div>The following screens will be deleted:</div>
    <div class="to-delete">
      {#each screens as screen}
        <div>{screen.route}</div>
      {/each}
    </div>
  </Layout>
</ConfirmDialog>

<style>
  .to-delete {
    font-weight: bold;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    padding-left: var(--spacing-xl);
  }
  .icon {
    display: grid;
    place-items: center;
  }
</style>
