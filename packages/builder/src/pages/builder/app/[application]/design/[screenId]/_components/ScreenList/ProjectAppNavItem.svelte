<script lang="ts">
  import { Icon, notifications } from "@budibase/bbui"
  import NavItem from "@/components/common/NavItem.svelte"
  import type { ProjectApp } from "@budibase/types"
  import { contextMenuStore, projectAppStore } from "@/stores/builder"
  import { confirm } from "@/helpers"

  export let projectApp: ProjectApp

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
        callback: () => {},
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
