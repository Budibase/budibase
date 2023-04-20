<script>
  import { automationStore } from "builderStore"
  import { notifications } from "@budibase/bbui"
  import { Icon, Input, ModalContent, Modal } from "@budibase/bbui"
  import { _ } from "../../../../lang/i18n"

  export let automation
  export let onCancel = undefined

  let name
  let error = ""
  let modal

  export const show = () => {
    name = automation?.name
    modal.show()
  }
  export const hide = () => {
    modal.hide()
  }

  async function saveAutomation() {
    try {
      const updatedAutomation = {
        ...automation,
        name,
      }
      await automationStore.actions.save(updatedAutomation)
      notifications.success(
        `${$_(
          "components.automation.AutomationPanel.UpdateAutomationModal.Automation"
        )} ${name} ${$_(
          "components.automation.AutomationPanel.UpdateAutomationModal.updated"
        )}`
      )
      hide()
    } catch (error) {
      notifications.error(
        $_(
          "components.automation.AutomationPanel.UpdateAutomationModal.Error_saving"
        )
      )
    }
  }

  function checkValid(evt) {
    name = evt.target.value
    if (!name) {
      error = $_(
        "components.automation.AutomationPanel.UpdateAutomationModal.Name_required"
      )
      return
    }
    error = ""
  }
</script>

<Modal bind:this={modal} on:hide={onCancel}>
  <ModalContent
    title={$_(
      "components.automation.AutomationPanel.UpdateAutomationModal.Edit_Automation"
    )}
    confirmText={$_(
      "components.automation.AutomationPanel.UpdateAutomationModal.Save"
    )}
    size="L"
    onConfirm={saveAutomation}
    disabled={error}
  >
    <Input
      bind:value={name}
      label={$_(
        "components.automation.AutomationPanel.UpdateAutomationModal.Name"
      )}
      on:input={checkValid}
      {error}
    />
    <a
      slot="footer"
      target="_blank"
      href="https://docs.budibase.com/docs/automation-steps"
    >
      <Icon name="InfoOutline" />
      <span
        >{$_(
          "components.automation.AutomationPanel.UpdateAutomationModal.automations"
        )}</span
      >
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
