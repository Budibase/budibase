<script>
  import { Input, ModalContent, Modal, Body } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"

  const dispatch = createEventDispatcher()

  export let dynamicVariables
  export let datasource
  export let binding

  let name, modal, valid, allVariableNames

  export const show = () => {
    modal.show()
  }
  export const hide = () => {
    modal.hide()
  }

  function checkValid(vars, name) {
    if (!name) {
      return false
    }
    return !allVariableNames.find(
      varName => varName.toLowerCase() === name.toLowerCase()
    )
  }

  $: valid = checkValid(dynamicVariables, name)
  $: allVariableNames = (datasource?.config?.dynamicVariables || []).map(
    variable => variable.name
  )
  $: error = name && !valid ? "Variable name is already in use." : null

  async function saveVariable() {
    const copiedName = name,
      copiedBinding = binding
    name = null
    binding = null
    dynamicVariables[copiedName] = copiedBinding
    dispatch("change", dynamicVariables)
  }
</script>

<Modal bind:this={modal}>
  <ModalContent
    title="Add dynamic variable"
    confirmText="Save"
    onConfirm={saveVariable}
    disabled={!valid}
  >
    <Body size="S"
      >Specify a name for your new dynamic variable, this must be unique across
      your datasource.</Body
    >
    <Input label="Variable name" bind:value={name} on:input {error} />
  </ModalContent>
</Modal>
