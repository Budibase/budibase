<script>
  import { automationStore } from "builderStore"
  import { notifications } from "@budibase/bbui"
  import { Icon, Input, ModalContent, Modal } from "@budibase/bbui"
  import analytics from "analytics"

  let name
  let error = ""
  let modal

  export let automation
  export let onCancel = undefined

  export const show = () => {
    name = automation?.name
    modal.show()
  }
  export const hide = () => {
    modal.hide()
  }

  async function saveAutomation() {
    const updatedAutomation = {
      ...automation,
      name,
    }
    await automationStore.actions.save(updatedAutomation)
    notifications.success(`Automation ${name} updated successfully.`)
    analytics.captureEvent("Automation Saved", { name })
    hide()
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
    title="Edit Automation"
    confirmText="Save"
    size="L"
    onConfirm={saveAutomation}
    disabled={error}
  >
    <Input bind:value={name} label="Name" on:input={checkValid} {error} />
    <a
      slot="footer"
      target="_blank"
      href="https://docs.budibase.com/automate/introduction-to-automate"
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
