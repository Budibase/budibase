<script>
  import { ActionMenu, MenuItem, Icon, Modal } from "@budibase/bbui"
  import DeleteModal from "components/deploy/DeleteModal.svelte"
  import AppLimitModal from "components/portal/licensing/AppLimitModal.svelte"
  import ExportAppModal from "./ExportAppModal.svelte"
  import DuplicateAppModal from "./DuplicateAppModal.svelte"
  import { onMount } from "svelte"
  import { licensing } from "stores/portal"

  export let app
  export let align = "right"
  export let options

  let deleteModal
  let exportModal
  let duplicateModal
  let exportPublishedVersion = false
  let loaded = false

  const getActions = app => {
    if (!loaded) {
      return []
    }
    return [
      {
        id: "duplicate",
        icon: "Copy",
        onClick: duplicateModal.show,
        body: "Duplicate",
      },
      {
        id: "exportDev",
        icon: "Export",
        onClick: () => {
          exportPublishedVersion = false
          exportModal.show()
        },
        body: "Export latest edited app",
      },
      {
        id: "exportProd",
        icon: "Export",
        onClick: () => {
          exportPublishedVersion = true
          exportModal.show()
        },
        body: "Export latest published app",
      },
      {
        id: "delete",
        icon: "Delete",
        onClick: deleteModal.show,
        body: "Delete",
      },
    ].filter(action => {
      if (action.id === "exportProd" && app.deployed !== true) {
        return false
      } else if (Array.isArray(options) && !options.includes(action.id)) {
        return false
      }
      return true
    })
  }

  $: actions = getActions(app, loaded)

  onMount(() => {
    loaded = true
  })
  let appLimitModal
</script>

<DeleteModal
  bind:this={deleteModal}
  appId={app.devId}
  appName={app.name}
  onDeleteSuccess={async () => {
    await licensing.init()
  }}
/>

<AppLimitModal bind:this={appLimitModal} />

<Modal bind:this={exportModal} padding={false}>
  <ExportAppModal {app} published={exportPublishedVersion} />
</Modal>

<Modal bind:this={duplicateModal} padding={false}>
  <DuplicateAppModal
    appId={app.devId}
    appName={app.name}
    onDuplicateSuccess={async () => {
      await licensing.init()
    }}
  />
</Modal>

<ActionMenu {align} on:open on:close>
  <div slot="control" class="icon">
    <Icon size="S" hoverable name="MoreSmallList" />
  </div>

  {#each actions as action}
    <MenuItem icon={action.icon} on:click={action.onClick}>
      {action.body}
    </MenuItem>
  {/each}
</ActionMenu>
