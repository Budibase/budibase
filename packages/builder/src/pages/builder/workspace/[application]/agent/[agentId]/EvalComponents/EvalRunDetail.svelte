<script lang="ts">
  import { Tab, Tabs } from "@budibase/bbui"
  import type { AgentEvalCaseResult, AgentEvalRun } from "@budibase/types"
  import EvalCaseOverview from "./EvalCaseOverview.svelte"
  import EvalCaseResults from "./EvalCaseResults.svelte"
  import DetailPane from "./DetailPane.svelte"
  import { formatRunTime } from "./utils"

  type Props = {
    selectedResult: AgentEvalCaseResult | null
    selectedRun: AgentEvalRun | null
  }

  let { selectedResult, selectedRun }: Props = $props()

  let selectedTab = $state("Overview")

  let subtitle = $derived(
    selectedRun
      ? `Viewing run ${selectedRun.passed}/${selectedRun.total} passed on ${formatRunTime(selectedRun.completedAt)}`
      : ""
  )

  let emptyText = $derived(
    selectedRun
      ? "Select a case from this run to inspect the snapshot and verdicts"
      : "Select a suite run to inspect its case results"
  )
</script>

<DetailPane
  title={selectedResult?.name ?? ""}
  {subtitle}
  {emptyText}
  isEmpty={!selectedRun || !selectedResult}
>
  {#if selectedResult && selectedRun}
    <Tabs bind:selected={selectedTab} noPadding size="M">
      <Tab title="Overview">
        <EvalCaseOverview {selectedResult} {selectedRun} />
      </Tab>
      <Tab title="Results">
        <EvalCaseResults {selectedResult} />
      </Tab>
    </Tabs>
  {/if}
</DetailPane>
