<script lang="ts">
  import NavItem from "@/components/common/NavItem.svelte"
  import { confirm } from "@/helpers"
  import { contextMenuStore, workspaceAppStore } from "@/stores/builder"
  import { Icon, Layout, notifications } from "@budibase/bbui"
  import type { UIWorkspaceApp } from "@budibase/types"
  import { goto } from "@roxi/routify"
  import { createEventDispatcher } from "svelte"
  import ScreenNavItem from "./ScreenNavItem.svelte"

  export let workspaceApp: UIWorkspaceApp
  export let searchValue: string

  const dispatch = createEventDispatcher<{ edit: void }>()

  async function onDelete() {
    await confirm({
      title: "Confirm Deletion",
      body: `Deleting "${workspaceApp.name}" cannot be undone. Are you sure?`,
      okText: "Delete app",
      warning: true,
      onConfirm: async () => {
        try {
          await workspaceAppStore.delete(workspaceApp._id, workspaceApp._rev)
          notifications.success(
            `App '${workspaceApp.name}' deleted successfully`
          )
        } catch (e: any) {
          let message = "Error deleting app"
          if (e.message) {
            message += ` - ${e.message}`
          }
          notifications.error(message)
        }
      },
    })
  }

  const openContextMenu = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const items = [
      {
        icon: "Add",
        name: "Add screen",
        keyBind: null,
        visible: true,
        callback: () => $goto("../new?workspaceAppId=" + workspaceApp._id),
      },
      {
        icon: "Edit",
        name: "Edit",
        keyBind: null,
        visible: true,
        callback: () => {
          dispatch("edit")
        },
      },
      {
        icon: "Delete",
        name: "Delete",
        keyBind: null,
        visible: true,
        callback: onDelete,
      },
    ]

    contextMenuStore.open("projectContextMenu", items, {
      x: e.clientX,
      y: e.clientY,
    })
  }

  $: noResultsMessage = searchValue
    ? "There aren't screens matching that route"
    : ""
</script>

<div class="project-app-nav-item">
  <NavItem
    on:contextmenu={openContextMenu}
    indentLevel={0}
    text={workspaceApp.name}
    showTooltip
    nonSelectable
  >
    <Icon on:click={openContextMenu} size="S" hoverable name="MoreSmallList" />
    <div slot="icon">
      <Icon name={workspaceApp.icon} size="XS" color={workspaceApp.iconColor} />
    </div>
  </NavItem>
</div>

<div class="screens">
  {#each workspaceApp.screens as screen (screen._id)}
    <div class="screen">
      <ScreenNavItem {screen} />
    </div>
  {:else}
    <Layout paddingY="none" paddingX="L">
      <div class="no-results">{noResultsMessage}</div>
    </Layout>
  {/each}
</div>

<style>
  .screens {
    border-left: 2px solid var(--spectrum-global-color-gray-200);
    padding-right: 12px;
    margin-left: 20px;
  }
  .screens .screen {
    margin-left: 8px;
  }

  .screens :global(.nav-item) {
    border-radius: 4px;
  }

  .screens :global(.nav-item-content) {
    padding-left: 8px;
  }

  .no-results {
    color: var(--spectrum-global-color-gray-600);
  }

  .project-app-nav-item :global(.nav-item-content .icon) {
    margin-right: 4px;
  }
</style>
