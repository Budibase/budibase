<script>
  import { Layout, Icon, ActionButton, InlineAlert } from "@budibase/bbui"
  import StatusRenderer from "./StatusRenderer.svelte"
  import DateTimeRenderer from "components/common/renderers/DateTimeRenderer.svelte"
  import TestDisplay from "components/automation/AutomationBuilder/TestDisplay.svelte"
  import { goto } from "@roxi/routify"
  import { automationStore } from "builderStore"

  export let history
  export let appId
  export let close
  const STOPPED_ERROR = "stopped_error"

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
    <Layout paddingY="XL" paddingX="XL" gap="S">
      <div class="icon">
        <Icon name="Clock" />
        <DateTimeRenderer value={history.createdAt} />
      </div>
      <div class="icon">
        <Icon name="JourneyVoyager" />
        <div>{history.automationName}</div>
      </div>
      {#if history.status === STOPPED_ERROR}
        <div class="cron-error">
          <InlineAlert
            type="error"
            header="CRON automation disabled"
            message="Fix the error and re-publish your app to re-activate."
          />
        </div>
      {/if}
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
      {#key history}
        <TestDisplay testResults={history} width="100%" />
      {/key}
    </div>
  </div>
{:else}
  <div>No details found</div>
{/if}

<style>
  .body {
    right: 0;
    background-color: var(--background);
    border-left: var(--border-light);
    width: 420px;
    height: calc(100vh - 240px);
    position: fixed;
    overflow: auto;
  }

  .top {
    padding: var(--spacing-m) 0 var(--spacing-m) 0;
    border-bottom: var(--border-light);
  }

  .bottom {
    border-top: var(--border-light);
    padding-top: calc(var(--spacing-xl) * 2);
    padding-bottom: calc(var(--spacing-xl) * 2);
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

  .cron-error {
    display: flex;
    width: 100%;
    justify-content: center;
  }
</style>
