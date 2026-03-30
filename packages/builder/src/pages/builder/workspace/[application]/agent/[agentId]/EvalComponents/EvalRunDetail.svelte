<script lang="ts">
  import { Body, Icon, Tab, Tabs } from "@budibase/bbui"
  import type { AgentEvalCaseResult, AgentEvalRun } from "@budibase/types"
  import EvalCaseOverview from "./EvalCaseOverview.svelte"
  import EvalCaseResults from "./EvalCaseResults.svelte"
  import { formatRunTime } from "./utils"

  type Props = {
    selectedResult: AgentEvalCaseResult | null
    selectedRun: AgentEvalRun | null
  }

  let { selectedResult, selectedRun }: Props = $props()

  let selectedTab = $state("Overview")
</script>

{#if selectedRun && selectedResult}
  <div class="detail-content">
    <div class="detail-header">
      <div class="detail-heading">
        <h3 class="detail-title">{selectedResult.name}</h3>
        <Body size="S" color="var(--spectrum-global-color-gray-600)">
          Viewing run {selectedRun.passed}/{selectedRun.total} passed on
          {formatRunTime(selectedRun.completedAt)}
        </Body>
      </div>
    </div>

    <Tabs bind:selected={selectedTab} noPadding size="M">
      <Tab title="Overview">
        <EvalCaseOverview
          selectedCase={null}
          {selectedResult}
          {selectedRun}
        />
      </Tab>
      <Tab title="Results">
        <EvalCaseResults {selectedResult} />
      </Tab>
    </Tabs>
  </div>
{:else if selectedRun}
  <div class="detail-empty">
    <Icon name="clock" size="L" color="var(--spectrum-global-color-gray-500)" />
    <Body size="S" color="var(--spectrum-global-color-gray-600)">
      Select a case from this run to inspect the snapshot and verdicts
    </Body>
  </div>
{:else}
  <div class="detail-empty">
    <Icon name="clock" size="L" color="var(--spectrum-global-color-gray-500)" />
    <Body size="S" color="var(--spectrum-global-color-gray-600)">
      Select a suite run to inspect its case results
    </Body>
  </div>
{/if}

<style>
  .detail-content {
    padding: var(--spacing-l);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-l);
  }

  .detail-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: var(--spacing-m);
  }

  .detail-heading {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
  }

  .detail-title {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: var(--spectrum-global-color-gray-900);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    min-width: 0;
  }

  .detail-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-m);
    height: 100%;
    padding: var(--spacing-xl);
    min-height: 200px;
  }
</style>
