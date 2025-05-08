<script lang="ts">
  import { Icon, notifications } from "@budibase/bbui"
  import NavItem from "@/components/common/NavItem.svelte"
  import type { UIProjectApp } from "@budibase/types"
  import { contextMenuStore, projectAppStore } from "@/stores/builder"
  import { confirm } from "@/helpers"
  import { createEventDispatcher } from "svelte"
  import ScreenNavItem from "./ScreenNavItem.svelte"

  export let projectApp: UIProjectApp

  const dispatch = createEventDispatcher<{ edit: void }>()

  async function onDelete() {
    await confirm({
      title: "Confirm Deletion",
      body: `Deleting "${projectApp.name}" cannot be undone. Are you sure?`,
      okText: "Delete app",
      warning: true,
      onConfirm: async () => {
        try {
          await projectAppStore.delete(projectApp._id, projectApp._rev)
          notifications.success(`App '${projectApp.name}' deleted successfully`)
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
    const items = [
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
        disabled: false,
        callback: onDelete,
      },
    ]

    contextMenuStore.open("projectContextMenu", items, {
      x: e.clientX,
      y: e.clientY,
    })
  }
</script>

<NavItem
  on:contextmenu={() => {
    /* TODO */
  }}
  scrollable
  indentLevel={0}
  text={projectApp.name}
  showTooltip
>
  <Icon on:click={openContextMenu} size="S" hoverable name="MoreSmallList" />
  <div slot="icon">
    <Icon name={projectApp.icon} size="S" color={projectApp.iconColor} />
  </div>
</NavItem>

<div class="screens">
  {#each projectApp.screens as screen (screen._id)}
    <div class="screen">
      <ScreenNavItem {screen} />
    </div>
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
</style>
