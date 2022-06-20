<script>
  import { Layout, Icon, ActionButton } from "@budibase/bbui"
  import StatusRenderer from "components/portal/overview/StatusRenderer.svelte"
  import DateTimeRenderer from "components/common/renderers/DateTimeRenderer.svelte"
  import TestDisplay from "components/automation/AutomationBuilder/TestDisplay.svelte"
  import { goto } from "@roxi/routify"
  import { automationStore } from "builderStore"

  export let history
  export let appId
  export let close

  $: exists = $automationStore.automations?.find(
    auto => auto._id === history?.automationId
  )
</script>

{#if history}
  <div class="body">
    <div class="top">
      <div class="controls">
        <StatusRenderer value={history.status} />
        <ActionButton noPadding size="S" icon="Close" quiet on:click={close} />
      </div>
    </div>
    <Layout paddingX="XL" gap="S">
      <div class="icon">
        <Icon name="Clock" />
        <DateTimeRenderer value={history.timestamp} />
      </div>
      <div class="icon">
        <Icon name="JourneyVoyager" />
        <div>{history.automationName}</div>
      </div>
      <div>
        {#if exists}
          <ActionButton
            icon="Edit"
            fullWidth={false}
            on:click={() =>
              $goto(`../../../app/${appId}/automate/${history.automationId}`)}
            >Edit automation</ActionButton
          >
        {/if}
      </div>
    </Layout>
    <div class="bottom">
      <TestDisplay testResults={history} width="100%" />
    </div>
  </div>
{:else}
  <div>No details found</div>
{/if}

<style>
  .body {
    background-color: var(--background);
    border-left: var(--border-light);
    height: 100%;
    width: 100%;
  }

  .top {
    padding: var(--spacing-m) 0 var(--spacing-m) 0;
    border-bottom: var(--border-light);
  }

  .bottom {
    margin-top: var(--spacing-m);
    border-top: var(--border-light);
    padding-top: calc(var(--spacing-xl) * 2);
    height: 100%;
  }

  .icon {
    display: flex;
    gap: var(--spacing-m);
  }

  .controls {
    padding: 0 var(--spacing-l) 0 var(--spacing-l);
    display: grid;
    grid-template-columns: 1fr auto;
    gap: var(--spacing-s);
  }
</style>
