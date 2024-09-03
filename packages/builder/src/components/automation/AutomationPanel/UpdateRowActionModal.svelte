<script>
  import { automationStore } from "stores/builder"
  import {
    notifications,
    Icon,
    Input,
    ModalContent,
    Modal,
  } from "@budibase/bbui"
  import { API } from "api"

  export let automation
  export let onCancel = undefined

  let name
  let error = ""
  let modal

  export const show = () => {
    name = automation?.displayName
    modal.show()
  }
  export const hide = () => {
    modal.hide()
  }

  async function saveAutomation() {
    try {
      await API.rowActions.update({
        rowActionId: automation.definition.trigger.inputs.rowActionId,
        tableId: automation.definition.trigger.inputs.tableId,
        name,
      })
      await automationStore.actions.fetch()
      notifications.success(`Row action updated successfully`)
      hide()
    } catch (error) {
      notifications.error("Error saving row action")
    }
  }

  function checkValid(evt) {
    name = evt.target.value
    if (!name) {
      error = "Name is required"
      return
    }
    error = ""
  }
</script>

<Modal bind:this={modal} on:hide={onCancel}>
  <ModalContent
    title="Edit Row Action"
    confirmText="Save"
    size="L"
    onConfirm={saveAutomation}
    disabled={error}
  >
    <Input bind:value={name} label="Name" on:input={checkValid} {error} />
    <a
      slot="footer"
      target="_blank"
      href="https://docs.budibase.com/docs/automation-steps"
    >
      <Icon name="InfoOutline" />
      <span>Learn about automations</span>
    </a>
  </ModalContent>
</Modal>

<style>
  a {
    color: var(--ink);
    font-size: 14px;
    vertical-align: middle;
    display: flex;
    align-items: center;
    text-decoration: none;
  }
  a span {
    text-decoration: underline;
    margin-left: var(--spectrum-alias-item-padding-s);
  }
</style>
