<script lang="ts">
  import NavItem from "@/components/common/NavItem.svelte"
  import { confirm } from "@/helpers"
  import { contextMenuStore, workspaceAppStore } from "@/stores/builder"
  import { Icon, notifications } from "@budibase/bbui"
  import type { UIWorkspaceApp, WorkspaceApp } from "@budibase/types"
  import NewScreenModal from "../../../_components/NewScreen/index.svelte"

  import WorkspaceAppNavItem from "./WorkspaceAppNavItem.svelte"
  import WorkspaceAppModal from "../WorkspaceApp/WorkspaceAppModal.svelte"

  export let workspaceApps: UIWorkspaceApp[]
  export let searchValue: string

  let workspaceAppModal: WorkspaceAppModal
  let selectedWorkspaceApp: WorkspaceApp | undefined

  let newScreenModal: NewScreenModal

  async function onDelete(workspaceApp: WorkspaceApp) {
    await confirm({
      title: "Confirm Deletion",
      body: `Deleting "${workspaceApp.name}" cannot be undone. Are you sure?`,
      okText: "Delete app",
      warning: true,
      onConfirm: async () => {
        try {
          await workspaceAppStore.delete(workspaceApp._id!, workspaceApp._rev!)
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

  const openContextMenu = (e: MouseEvent, workspaceApp: WorkspaceApp) => {
    e.preventDefault()
    e.stopPropagation()

    const items = [
      {
        icon: "Add",
        name: "Add screen",
        keyBind: null,
        visible: true,
        callback: () => newScreenModal.open(workspaceApp._id!),
      },
      {
        icon: "Edit",
        name: "Edit",
        keyBind: null,
        visible: true,
        callback: () => {
          onEditWorkspaceApp(workspaceApp)
        },
      },
      {
        icon: "Delete",
        name: "Delete",
        keyBind: null,
        visible: true,
        callback: () => onDelete(workspaceApp),
      },
    ]

    contextMenuStore.open("projectContextMenu", items, {
      x: e.clientX,
      y: e.clientY,
    })
  }

  function onEditWorkspaceApp(workspaceApp: WorkspaceApp) {
    selectedWorkspaceApp = workspaceApp
    workspaceAppModal.show()
  }
</script>

{#each workspaceApps as workspaceApp}
  <div class="project-app-nav-item">
    <NavItem
      on:contextmenu={e => openContextMenu(e, workspaceApp)}
      indentLevel={0}
      text={workspaceApp.name}
      showTooltip
      nonSelectable
      scrollable
    >
      <Icon
        on:click={e => openContextMenu(e, workspaceApp)}
        size="S"
        hoverable
        name="MoreSmallList"
      />
      <div slot="icon">
        <Icon
          name={workspaceApp.icon}
          size="XS"
          color={workspaceApp.iconColor}
        />
      </div>
    </NavItem>
  </div>
  <div class="screens">
    <WorkspaceAppNavItem {workspaceApp} {searchValue} />
  </div>
{/each}

<NewScreenModal bind:this={newScreenModal} />

<WorkspaceAppModal
  bind:this={workspaceAppModal}
  workspaceApp={selectedWorkspaceApp}
  on:hide={() => (selectedWorkspaceApp = undefined)}
/>

<style>
  .screens {
    border-left: 2px solid var(--spectrum-global-color-gray-300);
    padding-right: 12px;
    padding-left: 8px;
    margin-left: 20px;
  }

  .screens :global(.nav-item) {
    border-radius: 4px;
  }

  .screens :global(.nav-item-content) {
    padding-left: 8px;
  }

  .project-app-nav-item {
    margin-bottom: var(--spacing-xs);
  }

  .project-app-nav-item :global(.nav-item-content .icon) {
    margin-right: 4px;
  }
</style>
