<script lang="ts">
  import {
    Divider,
    ActionButton,
    notifications,
    Helpers,
    Icon,
    Button,
  } from "@budibase/bbui"
  import JSONViewer, {
    type JSONViewerClickEvent,
  } from "@/components/common/JSONViewer.svelte"
  import {
    type AutomationStep,
    type AutomationTrigger,
    type Automation,
    type LoopStepInputs,
    type DidNotTriggerResponse,
    type TestAutomationResponse,
    type BlockRef,
    type AutomationIOProps,
    type AutomationStepResult,
    AutomationStepStatus,
    AutomationStatus,
    AutomationStepType,
    isDidNotTriggerResponse,
    isTrigger,
    isFilterStep,
    isLoopStep,
    BlockDefinitionTypes,
    AutomationActionStepId,
  } from "@budibase/types"
  import Count from "./Count.svelte"
  import { automationStore, selectedAutomation } from "@/stores/builder"
  import {
    type BlockStatus,
    BlockStatusSource,
    BlockStatusType,
    DataMode,
    RowSteps,
  } from "@/types/automations"
  import { createEventDispatcher } from "svelte"
  import { cloneDeep } from "lodash"
  import { type AutomationContext } from "@/stores/builder/automations"

  export let context: AutomationContext | undefined
  export let block: AutomationStep | AutomationTrigger | undefined
  export let automation: Automation | undefined

  const dispatch = createEventDispatcher()

  const DataModeTabs = {
    [DataMode.INPUT]: "Data In",
    [DataMode.OUTPUT]: "Data Out",
    [DataMode.ERRORS]: "Errors",
  }

  // Add explicit weight to the issue types
  const issueOrder = {
    [BlockStatusType.ERROR]: 0,
    [BlockStatusType.WARN]: 1,
    [BlockStatusType.INFO]: 2,
  }

  let dataMode: DataMode = DataMode.INPUT
  let issues: BlockStatus[] = []

  $: blockRef = block?.id
    ? $selectedAutomation?.blockRefs?.[block.id]
    : undefined

  // The loop block associated with the selected block
  $: loopRef = blockRef?.looped
    ? $selectedAutomation.blockRefs[blockRef.looped]
    : undefined
  $: loopBlock = automationStore.actions.getBlockByRef(automation, loopRef)

  $: if ($automationStore.selectedNodeId) {
    dataMode = $automationStore.selectedNodeMode || DataMode.INPUT
  }

  $: testResults = $automationStore.testResults as TestAutomationResponse
  $: blockResults = automationStore.actions.processBlockResults(
    testResults,
    block
  )
  $: processTestIssues(testResults, block)

  /**
   * Take the results of an automation and generate a
   * list of graded issues. If the conditions get bigger they
   * could be broken out.
   *
   * @param testResults
   * @param block
   */
  const processTestIssues = (
    testResults: TestAutomationResponse,
    block: AutomationStep | AutomationTrigger | undefined
  ) => {
    // Reset issues
    issues = []

    if (!testResults || !block || !blockResults) {
      return
    }

    // Process loop issues
    if (blockRef?.looped && loopBlock && isLoopStep(loopBlock)) {
      const inputs = loopBlock.inputs as LoopStepInputs
      const loopMax = Number(inputs.iterations)
      const loopOutputs = blockResults?.outputs

      let loopMessage = "There was an error"

      // Not technically failed as it continues to run
      if (loopOutputs?.status === AutomationStepStatus.MAX_ITERATIONS) {
        loopMessage = `The maximum number of iterations (${loopMax}) has been reached.`
      } else if (
        loopOutputs?.status === AutomationStepStatus.FAILURE_CONDITION
      ) {
        loopMessage = `The failure condition for the loop was hit: ${inputs.failure}.
          The loop was terminated`
      } else if (loopOutputs?.status === AutomationStepStatus.INCORRECT_TYPE) {
        loopMessage = `An 'Input Type' of '${inputs.option}' was configured which does
          not match the value supplied`
      }

      issues.push({
        message: loopMessage,
        type: BlockStatusType.ERROR,
        source: BlockStatusSource.AUTOMATION_RESULTS,
      })
    }

    // Process filtered row issues
    else if (isTrigger(block) && isDidNotTriggerResponse(testResults)) {
      issues.push({
        message: (blockResults as DidNotTriggerResponse).message,
        type: BlockStatusType.WARN,
        source: BlockStatusSource.AUTOMATION_RESULTS,
      })
    }

    // Filter step
    else if (
      isFilterStep(block) &&
      blockResults?.outputs.status === AutomationStatus.STOPPED
    ) {
      issues.push({
        message: `The conditions were not met and 
          the automation flow was stopped.`,
        type: BlockStatusType.WARN,
        source: BlockStatusSource.AUTOMATION_RESULTS,
      })
    }

    // Row step issues
    else if (!isTrigger(block) && RowSteps.includes(block.stepId)) {
      const outputs = (blockResults as AutomationStepResult)?.outputs
      if (outputs.success) return
      issues.push({
        message: `Could not complete the row request: 
          ${outputs.response?.message || JSON.stringify(outputs.response)}`,
        type: BlockStatusType.ERROR,
        source: BlockStatusSource.AUTOMATION_RESULTS,
      })
    }

    // Default on error.
    else if (!isTrigger(block) && !blockResults.outputs.success) {
      issues.push({
        message: `There was an issue with the step. See 'Data out' for more information`,
        type: BlockStatusType.ERROR,
        source: BlockStatusSource.AUTOMATION_RESULTS,
      })
    }

    // Sort the issues
    issues.sort((a, b) => issueOrder[a.type] - issueOrder[b.type])
  }

  const copyContext = (e: JSONViewerClickEvent) => {
    Helpers.copyToClipboard(JSON.stringify(e.detail?.value))
    notifications.success("Copied to clipboard")
  }

  /**
   * Take the core AutomationContext and humanise it
   * Before the test is run, populate the "Data in" values
   * with the schema definition keyed by the readable step names.
   */
  const parseContext = (context?: AutomationContext, blockRef?: BlockRef) => {
    if (!blockRef || !automation) {
      return
    }

    let clonetext = cloneDeep(context)

    const pathSteps = automationStore.actions.getPathSteps(
      blockRef.pathTo,
      automation
    )

    const defs = $automationStore.blockDefinitions
    const stepNames = automation.definition.stepNames
    const loopDef =
      defs[BlockDefinitionTypes.ACTION]?.[AutomationActionStepId.LOOP]

    // Exclude the trigger and loops from steps
    const filteredSteps: Record<string, AutomationStep | AutomationIOProps> =
      pathSteps
        .slice(0, -1)
        .filter(
          (step): step is AutomationStep =>
            step.type === AutomationStepType.ACTION &&
            step.stepId !== AutomationActionStepId.LOOP
        )
        .reduce(
          (
            acc: Record<string, AutomationStep | AutomationIOProps>,
            step: AutomationStep
          ) => {
            // Process the block
            const blockRef = $selectedAutomation.blockRefs[step.id]
            const blockDefinition =
              defs[BlockDefinitionTypes.ACTION]?.[step.stepId]

            // Check if the block has a loop
            const loopRef = blockRef.looped
              ? $selectedAutomation.blockRefs[blockRef.looped]
              : undefined

            const testData = context?.steps?.[step.id]
            const sampleDef = loopRef ? loopDef : blockDefinition

            // Prioritise the display of testData and fallback to step defs
            // This will ensure users have at least an idea of what they are looking at
            acc[stepNames?.[step.id] || step.name] =
              testData || sampleDef?.schema.outputs.properties || {}

            return acc
          },
          {} as Record<string, AutomationStep | AutomationIOProps>
        )

    return { ...clonetext, steps: filteredSteps }
  }

  $: parsedContext = parseContext(context, blockRef)
</script>

<div class="tabs">
  {#each Object.values(DataMode) as mode}
    <Count count={mode === DataMode.ERRORS ? issues.length : 0}>
      <ActionButton
        selected={mode === dataMode}
        quiet
        on:click={() => {
          dataMode = mode
        }}
      >
        {DataModeTabs[mode]}
      </ActionButton>
    </Count>
  {/each}
</div>
<Divider noMargin />
<div class="viewer">
  {#if dataMode === DataMode.INPUT}
    <JSONViewer
      value={parsedContext}
      showCopyIcon
      on:click-copy={copyContext}
    />
  {:else if dataMode === DataMode.OUTPUT}
    {#if blockResults}
      <JSONViewer
        value={blockResults.outputs}
        showCopyIcon
        on:click-copy={copyContext}
      />
    {:else if testResults && !blockResults}
      <div class="content">
        <span class="info">
          This step was not executed as part of the test run
        </span>
      </div>
    {:else}
      <div class="content">
        <span class="info">
          Run the automation to show the output of this step
        </span>
        <Button
          size={"S"}
          icon={"Play"}
          secondary
          on:click={() => {
            dispatch("run")
          }}
        >
          Run
        </Button>
      </div>
    {/if}
  {:else}
    <div class="issues" class:empty={!issues.length}>
      {#if issues.length === 0}
        <span>There are no current issues</span>
      {:else}
        {#each issues as issue}
          <div class={`issue ${issue.type}`}>
            <div class="icon"><Icon name="Alert" /></div>
            <!-- For custom automations, the error message needs a default -->
            <div class="message">
              {issue.message || "There was an error"}
            </div>
          </div>
          <Divider noMargin />
        {/each}
      {/if}
    </div>
  {/if}
</div>

<style>
  .content .info {
    text-align: center;
    max-width: 70%;
  }
  .tabs,
  .viewer {
    padding: var(--spacing-l);
  }
  .viewer {
    overflow-y: scroll;
    flex: 1;
    padding-right: 0px;
  }
  .viewer .content {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: var(--spacing-l);
  }
  .tabs {
    display: flex;
    gap: var(--spacing-s);
    padding: var(--spacing-m) var(--spacing-l);
  }
  .issue {
    display: flex;
    gap: var(--spacing-s);
    width: 100%;
    box-sizing: border-box;
    padding-bottom: var(--spacing-l);
  }
  .issues {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .issues.empty {
    align-items: center;
    justify-content: center;
  }
  .issue.error .icon {
    color: var(--spectrum-global-color-static-red-600);
  }
  .issue.warn .icon {
    color: var(--spectrum-global-color-static-yellow-600);
  }
  .issues :global(hr.spectrum-Divider:last-child) {
    display: none;
  }
  .issues .issue:not(:first-child) {
    padding-top: var(--spacing-l);
  }
  .issues {
    word-break: break-word;
  }
</style>
