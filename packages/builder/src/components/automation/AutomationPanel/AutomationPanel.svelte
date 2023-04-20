<script>
  import AutomationList from "./AutomationList.svelte"
  import CreateAutomationModal from "./CreateAutomationModal.svelte"
  import { Modal, Button, Layout } from "@budibase/bbui"
  import Panel from "components/design/Panel.svelte"
  import { _ } from "../../../../lang/i18n"

  export let modal
  export let webhookModal
</script>

<Panel title="Automations" borderRight>
  <Layout paddingX="L" paddingY="XL" gap="S">
    <Button cta on:click={modal.show}
      >{$_(
        "components.automation.AutomationPanel.AutomationPanel.Add_automation"
      )}</Button
    >
    <AutomationList />
  </Layout>
</Panel>

<Modal bind:this={modal}>
  <CreateAutomationModal {webhookModal} />
</Modal>
