<script>
  import { Select, Label, notifications, ModalContent } from "@budibase/bbui"
  import { tables, views } from "stores/backend"
  import analytics from "analytics"
  import { FIELDS } from "constants/backend"
  import { _ as t } from "svelte-i18n"

  const CALCULATIONS = [
    {
      name: $t("statistics"),
      key: "stats",
    },
    {
      name: $t("count"),
      key: "count",
    },
    {
      name: $t("sum"),
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
    views.save(view)
    notifications.success($t("view") + ` ${view.name} ` + $t("saved") + `.`)
    analytics.captureEvent($t("added-view-calculate"), { field: view.field })
  }
</script>

<ModalContent
  cancelText={$t("cancel")}
  title={$t("calculate")}
  confirmText={$t("save")}
  onConfirm={saveView}
  disabled={!view.field}
>
  <div class="input-group-row">
    <Label>{$t("the")}</Label>
    <Select
      bind:value={view.calculation}
      options={CALCULATIONS}
      getOptionLabel={x => x.name}
      getOptionValue={x => x.key}
    />
    {#if view.calculation}
      <Label>{$t("of")}</Label>
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
