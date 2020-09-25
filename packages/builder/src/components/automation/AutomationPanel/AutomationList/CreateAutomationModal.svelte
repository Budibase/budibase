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

<div class="container">
  <header>
    <i class="ri-stackshare-line" />
    Create Automation
  </header>
  <div class="content">
    <Input bind:value={name} label="Name" />
  </div>
  <footer>
    <a href="https://docs.budibase.com">
      <i class="ri-information-line" />
      <span>Learn about automations</span>
    </a>
    <ActionButton secondary on:click={onClosed}>Cancel</ActionButton>
    <ActionButton disabled={!valid} on:click={createAutomation}>
      Save
    </ActionButton>
  </footer>
</div>

<style>
  .container {
    padding: var(--spacing-xl);
  }

  header {
    font-size: var(--font-size-xl);
    color: var(--ink);
    font-weight: 600;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }
  header i {
    margin-right: var(--spacing-m);
    font-size: 20px;
    background: var(--purple);
    color: var(--white);
    padding: var(--spacing-s);
    border-radius: var(--border-radius-m);
    display: inline-block;
  }

  .content {
    padding: var(--spacing-xl) 0;
  }

  footer {
    display: grid;
    grid-auto-flow: column;
    grid-gap: var(--spacing-m);
    grid-auto-columns: 3fr 1fr 1fr;
  }
  footer a {
    color: var(--ink);
    font-size: 14px;
    vertical-align: middle;
    display: flex;
    align-items: center;
    text-decoration: none;
  }
  footer a span {
    text-decoration: underline;
  }
  footer i {
    font-size: 20px;
    margin-right: var(--spacing-m);
    text-decoration: none;
  }
</style>
