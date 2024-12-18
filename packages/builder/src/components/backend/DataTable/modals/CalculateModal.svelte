<script>
  import { Select, Label, notifications, ModalContent } from "@budibase/bbui"
  import { tables, views } from "@/stores/builder"
  import { FIELDS } from "@/constants/backend"

  const CALCULATIONS = [
    {
      name: "Statistics",
      key: "stats",
    },
    {
      name: "Count",
      key: "count",
    },
    {
      name: "Sum",
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
      notifications.success(`View ${view.name} saved`)
    } catch (error) {
      notifications.error("Error saving view")
    }
  }
</script>

<ModalContent
  title="Calculate"
  confirmText="Save"
  onConfirm={saveView}
  disabled={!view.field}
>
  <div class="input-group-row">
    <Label>The</Label>
    <Select
      bind:value={view.calculation}
      options={CALCULATIONS}
      getOptionLabel={x => x.name}
      getOptionValue={x => x.key}
    />
    {#if view.calculation}
      <Label>Of</Label>
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
