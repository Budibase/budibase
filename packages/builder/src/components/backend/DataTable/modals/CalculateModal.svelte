<script>
  import { Select, Label, notifications, ModalContent } from "@budibase/bbui"
  import { tables, views } from "stores/backend"
  import { FIELDS } from "constants/backend"
  import { _ } from "../../../../../lang/i18n"

  const CALCULATIONS = [
    {
      name: $_("components.backend.DataTable.modals.CalculateModal.Statistics"),
      key: "stats",
    },
    {
      name: $_("components.backend.DataTable.modals.CalculateModal.Count"),
      key: "count",
    },
    {
      name: $_("components.backend.DataTable.modals.CalculateModal.Sum"),
      key: "sum",
    },
  ]

  export let view = {}

  $: viewTable = $tables.list.find(
    ({ _id }) => _id === $views.selected?.tableId
  )
  $: fields =
    viewTable &&
    Object.keys(viewTable.schema).filter(fieldName => {
      const field = viewTable.schema[fieldName]
      return (
        field.type !== FIELDS.FORMULA.type &&
        field.type !== FIELDS.LINK.type &&
        (view.calculation === "count" ||
          // don't want to perform calculations based on auto ID
          (field.type === "number" && !field.autocolumn))
      )
    })

  function saveView() {
    try {
      views.save(view)
      notifications.success(
        `${$_("components.backend.DataTable.modals.CalculateModal.View")} ${
          view.name
        } ${$_("components.backend.DataTable.modals.CalculateModal.saved")}`
      )
    } catch (error) {
      notifications.error(
        $_("components.backend.DataTable.modals.CalculateModal.Error_saving")
      )
    }
  }
</script>

<ModalContent
  title={$_("components.backend.DataTable.modals.CalculateModal.Calculate")}
  confirmText={$_("components.backend.DataTable.modals.CalculateModal.Save")}
  onConfirm={saveView}
  disabled={!view.field}
>
  <div class="input-group-row">
    <Label>{$_("components.backend.DataTable.modals.CalculateModal.The")}</Label
    >
    <Select
      bind:value={view.calculation}
      options={CALCULATIONS}
      getOptionLabel={x => x.name}
      getOptionValue={x => x.key}
    />
    {#if view.calculation}
      <Label
        >{$_("components.backend.DataTable.modals.CalculateModal.Of")}</Label
      >
      <Select bind:value={view.field} options={fields} />
    {/if}
  </div>
</ModalContent>

<style>
  .input-group-row {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: var(--spacing-s);
    align-items: center;
  }
</style>
