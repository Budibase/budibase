<script>
  import { createEventDispatcher } from "svelte"
  import { tables } from "@/stores/builder"
  import { ModalContent, keepOpen, notifications } from "@budibase/bbui"
  import RowFieldControl from "../RowFieldControl.svelte"
  import { API } from "@/api"
  import { FIELDS } from "@/constants/backend"

  const FORMULA_TYPE = FIELDS.FORMULA.type
  const AI_TYPE = FIELDS.AI.type

  export let row = {}

  let errors = []
  const dispatch = createEventDispatcher()

  $: creating = row?._id == null
  $: table = row.tableId
    ? $tables.list.find(table => table._id === row?.tableId)
    : $tables.selected
  $: tableSchema = Object.entries(table?.schema ?? {})

  async function saveRow() {
    errors = []
    try {
      const res = await API.saveRow({ ...row, tableId: table._id })
      notifications.success("Row saved successfully")
      dispatch("updaterows", res._id)
    } catch (error) {
      const response = error.json
      if (error.handled && response?.errors) {
        errors = response.errors
      } else if (error.handled && response?.validationErrors) {
        const mappedErrors = {}
        for (let field in response.validationErrors) {
          mappedErrors[
            field
          ] = `${field} ${response.validationErrors[field][0]}`
        }
        errors = mappedErrors
      } else {
        notifications.error(`Failed to save row - ${error.message}`)
      }

      return keepOpen
    }
  }
</script>

<span class="modal-wrap">
  <ModalContent
    title={creating ? "Create Row" : "Edit Row"}
    confirmText={creating ? "Create Row" : "Save Row"}
    onConfirm={saveRow}
    showCancelButton={creating}
    showSecondaryButton={!creating}
    secondaryButtonWarning={!creating}
    secondaryButtonText="Delete"
    secondaryAction={() => {
      dispatch("deleteRows", row)
    }}
  >
    {#each tableSchema as [key, meta]}
      {#if !meta.autocolumn && meta.type !== FORMULA_TYPE && meta.type !== AI_TYPE}
        <div>
          <RowFieldControl error={errors[key]} {meta} bind:value={row[key]} />
        </div>
      {/if}
    {/each}
  </ModalContent>
</span>

<style>
  div {
    min-width: 0;
  }
  .modal-wrap :global(.secondary-action) {
    margin-right: unset;
  }
</style>
