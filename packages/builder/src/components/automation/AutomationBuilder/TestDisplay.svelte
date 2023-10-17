<script>
  import { Icon, Divider, Tabs, Tab, TextArea, Label } from "@budibase/bbui"
  import FlowItemHeader from "./FlowChart/FlowItemHeader.svelte"
  import { ActionStepID } from "constants/backend/automations"

  export let automation
  export let testResults
  export let width = "400px"

  let openBlocks = {}
  let blocks

  function prepTestResults(results) {
    return results?.steps.filter(x => x.stepId !== ActionStepID.LOOP || [])
  }

  function textArea(results, message) {
    if (!results) {
      return message
    }
    return JSON.stringify(results, null, 2)
  }

  $: filteredResults = prepTestResults(testResults)

  $: {
    blocks = []
    if (automation) {
      if (automation.definition.trigger) {
        blocks.push(automation.definition.trigger)
      }
      blocks = blocks
        .concat(automation.definition.steps || [])
        .filter(x => x.stepId !== ActionStepID.LOOP)
    } else if (filteredResults) {
      blocks = filteredResults || []
      // make sure there is an ID for each block being displayed
      let count = 0
      for (let block of blocks) {
        block.id = count++
      }
    }
  }
</script>

<div class="container">
  {#each blocks as block, idx}
    <div class="block" style={width ? `width: ${width}` : ""}>
      {#if block.stepId !== ActionStepID.LOOP}
        <FlowItemHeader
          open={!!openBlocks[block.id]}
          on:toggle={() => (openBlocks[block.id] = !openBlocks[block.id])}
          isTrigger={idx === 0}
          testResult={filteredResults?.[idx]}
          showTestStatus
          {block}
          {idx}
        />
        {#if openBlocks[block.id]}
          <Divider noMargin />
          {#if filteredResults?.[idx]?.outputs?.iterations}
            <div style="display: flex; padding: 10px 10px 0px 12px;">
              <Icon name="Reuse" />
              <div style="margin-left: 10px;">
                <Label>
                  This loop ran {filteredResults?.[idx]?.outputs.iterations} times.</Label
                >
              </div>
            </div>
          {/if}

          <div class="tabs">
            <Tabs noHorizPadding selected="Input">
              <Tab title="Input">
                <TextArea
                  minHeight="160px"
                  disabled
                  value={textArea(filteredResults?.[idx]?.inputs, "No input")}
                />
              </Tab>
              <Tab title="Output">
                <TextArea
                  minHeight="160px"
                  disabled
                  value={textArea(filteredResults?.[idx]?.outputs, "No output")}
                />
              </Tab>
            </Tabs>
          </div>
        {/if}
      {/if}
    </div>
    {#if blocks.length - 1 !== idx}
      <div class="separator" />
    {/if}
  {/each}
</div>

<style>
  .container {
    padding: 0 30px 30px 30px;
    height: 100%;
    overflow: auto;
  }

  .tabs {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    position: relative;
    flex: 1 1 auto;
    padding: 0 var(--spacing-xl) var(--spacing-xl) var(--spacing-xl);
  }

  .block {
    display: inline-block;
    width: 400px;
    height: auto;
    font-size: 16px;
    background-color: var(--background);
    border: 1px solid var(--spectrum-global-color-gray-300);
    border-radius: 4px 4px 4px 4px;
  }

  .separator {
    width: 1px;
    height: 40px;
    border-left: 1px dashed var(--grey-4);
    color: var(--grey-4);
    /* center horizontally */
    text-align: center;
    margin-left: 50%;
  }
</style>
