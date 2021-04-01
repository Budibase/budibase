<script>
<<<<<<< HEAD
  import { backendUiStore, automationStore } from "builderStore"
  import { goto } from "@roxi/routify"
=======
  import { automationStore } from "builderStore"
  import { database } from 'stores/backend/'
  import { goto } from "@sveltech/routify"
>>>>>>> d803aa0bd7a74220e432f4a1b338abdd7fbe9b7d
  import { notifier } from "builderStore/store/notifications"
  import { Input, ModalContent } from "@budibase/bbui"
  import analytics from "analytics"

  let name

  $: valid = !!name
  $: instanceId = $database._id

  async function createAutomation() {
    await automationStore.actions.create({
      name,
      instanceId,
    })
    notifier.success(`Automation ${name} created.`)
    $goto(`./${$automationStore.selectedAutomation.automation._id}`)
    analytics.captureEvent("Automation Created", { name })
  }
</script>

<ModalContent
  title="Create Automation"
  confirmText="Create"
  onConfirm={createAutomation}
  disabled={!valid}>
  <Input bind:value={name} label="Name" />
  <div slot="footer">
    <a
      target="_blank"
      href="https://docs.budibase.com/automate/introduction-to-automate">
      <i class="ri-information-line" />
      <span>Learn about automations</span>
    </a>
  </div>
</ModalContent>

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
  }
  i {
    font-size: 20px;
    margin-right: var(--spacing-m);
    text-decoration: none;
  }
</style>
