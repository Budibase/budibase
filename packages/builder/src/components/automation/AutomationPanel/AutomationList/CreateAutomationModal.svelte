<script>
  import { store, backendUiStore, automationStore } from "builderStore"
  import { notifier } from "builderStore/store/notifications"
  import { Input } from "@budibase/bbui"
  import analytics from "analytics"
  import { ModalTitle, ModalFooter } from "components/common/Modal"

  let name

  $: valid = !!name
  $: instanceId = $backendUiStore.selectedDatabase._id
  $: appId = $store.appId

  function sleep(ms) {
    return new Promise(resolve => {
      setTimeout(resolve, ms)
    })
  }

  async function createAutomation() {
    await automationStore.actions.create({
      name,
      instanceId,
    })
    notifier.success(`Automation ${name} created.`)
    analytics.captureEvent("Automation Created", { name })
  }
</script>

<ModalTitle>Create Automation</ModalTitle>
<Input bind:value={name} label="Name" />
<ModalFooter
  confirmText="Create"
  onConfirm={createAutomation}
  disabled={!valid}>
  <a
    target="_blank"
    href="https://docs.budibase.com/automate/introduction-to-automate">
    <i class="ri-information-line" />
    <span>Learn about automations</span>
  </a>
</ModalFooter>

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
