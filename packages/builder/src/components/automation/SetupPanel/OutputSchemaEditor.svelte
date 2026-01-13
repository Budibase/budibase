<script>
  import { ActionButton, Modal } from "@budibase/bbui"
  import JSONSchemaModal from "@/components/backend/DataTable/modals/JSONSchemaModal.svelte"
  import { createEventDispatcher } from "svelte"

  export let value = {}

  const dispatch = createEventDispatcher()
  let modal

  $: fieldCount = Object.keys(value || {}).length

  function onSave({ detail }) {
    dispatch("change", detail.schema)
    modal.hide()
  }
</script>

<ActionButton fullWidth on:click={() => modal.show()}>
  {fieldCount > 0
    ? `Edit Schema (${fieldCount} fields)`
    : "Define Output Schema"}
</ActionButton>

<Modal bind:this={modal}>
  <JSONSchemaModal schema={value} on:save={onSave} />
</Modal>
