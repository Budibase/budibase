<script>
  import { Input, notifications, ModalContent } from "@budibase/bbui"
  import { goto } from "@roxi/routify"
  import { views as viewsStore } from "stores/backend"
  import { tables } from "stores/backend"
  import { _ } from "../../../../../lang/i18n"

  let name
  let field

  $: views = $tables.list.flatMap(table => Object.keys(table.views || {}))

  const saveView = async () => {
    name = name?.trim()
    if (views.includes(name)) {
      notifications.error(
        `${$_(
          "components.backend.DataTable.modals.CreateViewModal.exists_name"
        )} ${name}`
      )
      return
    }
    try {
      await viewsStore.save({
        name,
        tableId: $tables.selected._id,
        field,
      })
      notifications.success(
        `${$_(
          "components.backend.DataTable.modals.CreateViewModal.View"
        )} ${name} ${$_(
          "components.backend.DataTable.modals.CreateViewModal.created"
        )}`
      )
      $goto(`../../view/${encodeURIComponent(name)}`)
    } catch (error) {
      notifications.error(
        $_("components.backend.DataTable.modals.CreateViewModal.Error_creating")
      )
    }
  }
</script>

<ModalContent
  title={$_("components.backend.DataTable.modals.CreateViewModal.Create_View")}
  confirmText={$_(
    "components.backend.DataTable.modals.CreateViewModal.Create_View"
  )}
  onConfirm={saveView}
>
  <Input
    label={$_("components.backend.DataTable.modals.CreateViewModal.View_Name")}
    thin
    bind:value={name}
  />
</ModalContent>
