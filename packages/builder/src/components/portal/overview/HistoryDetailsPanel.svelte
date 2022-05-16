<script>
  import { Body, Layout, Icon, ActionButton, Heading } from "@budibase/bbui"
  import { capitalise } from "helpers"
  import StatusRenderer from "components/portal/overview/StatusRenderer.svelte"
  import DateTimeRenderer from "components/common/renderers/DateTimeRenderer.svelte"
  import FlowItemHeader from "components/automation/AutomationBuilder/FlowChart/FlowItemHeader.svelte"

  export let history
  export let close

  $: console.log(history)
</script>

{#if history}
  <div class="body">
    <div class="top">
      <div class="controls">
        <Icon name="Clock" />
        <Body>Run log details</Body>
        <ActionButton noPadding size="S" icon="Close" quiet on:click={close} />
      </div>
    </div>
    <Layout paddingX="XL" gap="S">
      <Heading>{capitalise(history.appName || "")}</Heading>
      <StatusRenderer value={history.status} />
      <div class="icon">
        <Icon name="Clock" />
        <DateTimeRenderer value={history.timestamp} />
      </div>
      <div class="icon">
        <Icon name="JourneyVoyager" />
        <Body>{history.name}</Body>
      </div>
      <div>
        <ActionButton icon="Edit" fullWidth={false}
          >Edit automation</ActionButton
        >
      </div>
    </Layout>
    <div class="bottom">
      {#each history.steps as step}
        <FlowItemHeader useResultsModal={false} block={step} />
      {/each}
    </div>
  </div>
{:else}
  <Body>No details found</Body>
{/if}

<style>
  .body {
    background-color: var(--background);
    border-left: var(--border-light);
    height: 100%;
    width: 100%;
  }

  .top {
    padding: var(--spacing-l) 0 var(--spacing-l) 0;
    border-bottom: var(--border-light);
  }

  .bottom {
    margin-top: var(--spacing-m);
    border-top: var(--border-light);
  }

  .icon {
    display: flex;
    gap: var(--spacing-m);
  }

  .controls {
    padding: 0 var(--spacing-l) 0 var(--spacing-l);
    display: grid;
    grid-template-columns: auto 1fr auto;
    gap: var(--spacing-s);
  }
</style>
