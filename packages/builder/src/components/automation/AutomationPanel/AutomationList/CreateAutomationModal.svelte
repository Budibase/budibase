<script>
  import { store, backendUiStore, automationStore } from "builderStore"
  import { notifier } from "builderStore/store/notifications"
  import ActionButton from "components/common/ActionButton.svelte"
  import { Input } from "@budibase/bbui"

  export let onClosed

  let name

  $: valid = !!name
  $: instanceId = $backendUiStore.selectedDatabase._id
  $: appId = $store.appId

  async function createAutomation() {
    await automationStore.actions.create({
      name,
      instanceId,
    })
    onClosed()
    notifier.success(`Automation ${name} created.`)
  }
</script>

<header>
  <i class="ri-stackshare-line" />
  Create Automation
</header>
<div>
  <Input bind:value={name} label="Name" />
</div>
<footer>
  <a href="https://docs.budibase.com">
    <i class="ri-information-line" />
    Learn about automations
  </a>
  <ActionButton secondary on:click={onClosed}>Cancel</ActionButton>
  <ActionButton disabled={!valid} on:click={createAutomation}>Save</ActionButton>
</footer>

<style>
  header {
    font-size: 24px;
    color: var(--ink);
    font-weight: bold;
    padding: 30px;
  }

  header i {
    margin-right: 10px;
    font-size: 20px;
    background: var(--blue-light);
    color: var(--grey-4);
    padding: 8px;
  }

  div {
    padding: 0 30px 30px 30px;
  }

  label {
    font-size: 18px;
    font-weight: 500;
  }

  footer {
    display: grid;
    grid-auto-flow: column;
    grid-gap: 5px;
    grid-auto-columns: 3fr 1fr 1fr;
    padding: 20px;
    background: var(--grey-1);
    border-radius: 0.5rem;
  }

  footer a {
    color: var(--primary);
    font-size: 14px;
    vertical-align: middle;
    display: flex;
    align-items: center;
  }

  footer i {
    font-size: 20px;
    margin-right: 10px;
  }
</style>
