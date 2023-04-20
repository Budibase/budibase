<script>
  import { Select, ModalContent, notifications } from "@budibase/bbui"
  import { tables, views } from "stores/backend"
  import { FIELDS } from "constants/backend"
  import { _ } from "../../../../../lang/i18n"

  export let view = {}

  $: viewTable = $tables.list.find(
    ({ _id }) => _id === $views.selected?.tableId
  )
  $: fields =
    viewTable &&
    Object.entries(viewTable.schema)
      .filter(
        entry =>
          entry[1].type !== FIELDS.LINK.type &&
          entry[1].type !== FIELDS.FORMULA.type
      )
      .map(([key]) => key)

  function saveView() {
    try {
      views.save(view)
      notifications.success(
        `${$_("components.backend.DataTable.modals.GroupByModal.View")} ${
          view.name
        } ${$_("components.backend.DataTable.modals.GroupByModal.saved")}`
      )
    } catch (error) {
      notifications.error(
        $_("components.backend.DataTable.modals.GroupByModal.Error_saving")
      )
    }
  }
</script>

<ModalContent
  title={$_("components.backend.DataTable.modals.GroupByModal.Group By")}
  confirmText={$_("components.backend.DataTable.modals.GroupByModal.Save")}
  onConfirm={saveView}
>
  <Select bind:value={view.groupBy} options={fields} />
</ModalContent>
