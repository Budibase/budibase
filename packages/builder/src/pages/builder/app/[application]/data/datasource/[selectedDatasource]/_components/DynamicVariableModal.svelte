<script>
  import { Input, ModalContent, Modal } from "@budibase/bbui"

  export let dynamicVariables
  export let binding

  let name, modal, valid

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
    const varKeys = Object.keys(vars || {})
    return varKeys.find(key => key.toLowerCase() === name.toLowerCase()) == null
  }

  $: valid = checkValid(dynamicVariables, name)
  $: error = name && !valid ? "Variable name is already in use." : null

  async function saveVariable() {
    const copiedName = name,
      copiedBinding = binding
    name = null
    binding = null
    dynamicVariables[copiedName] = copiedBinding
  }
</script>

<Modal bind:this={modal}>
  <ModalContent
    title="Add dynamic variable"
    confirmText="Save"
    onConfirm={saveVariable}
    disabled={!valid}
  >
    <Input label="Variable name" bind:value={name} on:input {error} />
  </ModalContent>
</Modal>
