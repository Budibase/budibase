<script>
  import { _ } from "../../../lang/i18n"
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
  $: error =
    name && !valid
      ? $_("components.integration.DynamicVariableModal.Variable_name_use")
      : null

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
    title={$_("components.integration.DynamicVariableModal.Add_variable")}
    confirmText={$_("components.integration.DynamicVariableModal.Save")}
    onConfirm={saveVariable}
    disabled={!valid}
  >
    <Body size="S"
      >{$_("components.integration.DynamicVariableModal.Specify_nmae")}</Body
    >
    <Input
      label={$_("components.integration.DynamicVariableModal.Variable_name")}
      bind:value={name}
      on:input
      {error}
    />
  </ModalContent>
</Modal>
