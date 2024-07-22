<script>
  import { Icon, Divider, Tabs, Tab, Label } from "@budibase/bbui"
  import FlowItemHeader from "./FlowChart/FlowItemHeader.svelte"
  import { ActionStepID } from "constants/backend/automations"
  import { JsonView } from "@zerodevx/svelte-json-view"

  export let automation
  export let testResults
  export let width = "400px"

  let openBlocks = {}
  let blocks

  function prepTestResults(results) {
    if (results.message) {
      return [
        {
          inputs: {},
          outputs: {
            success: results.outputs?.success || false,
            status: results.outputs?.status || "unknown",
            message: results.message,
          },
        },
      ]
    } else {
      return results?.steps?.filter(x => x.stepId !== ActionStepID.LOOP) || []
    }
  }

  $: filteredResults = prepTestResults(testResults)

  $: {
    if (testResults.message) {
      blocks = automation?.definition?.trigger
        ? [automation.definition.trigger]
        : []
    } else if (automation) {
      blocks = []
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
          enableNaming={false}
          open={!!openBlocks[block.id]}
          on:toggle={() => (openBlocks[block.id] = !openBlocks[block.id])}
          isTrigger={idx === 0}
          testResult={testResults.message
            ? testResults
            : filteredResults?.[idx]}
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
            <Tabs quiet noHorizPadding selected="Input">
              <Tab title="Input">
                <div class="wrap">
                  {#if testResults.message}
                    No input
                  {:else if filteredResults?.[idx]?.inputs}
                    <JsonView depth={2} json={filteredResults?.[idx]?.inputs} />
                  {:else}
                    No input
                  {/if}
                </div>
              </Tab>
              <Tab title="Output">
                <div class="wrap">
                  {#if testResults.message}
                    <JsonView
                      depth={2}
                      json={{
                        success: testResults.outputs?.success || false,
                        status: testResults.outputs?.status || "unknown",
                        message: testResults.message,
                      }}
                    />
                  {:else if filteredResults?.[idx]?.outputs}
                    <JsonView
                      depth={2}
                      json={filteredResults?.[idx]?.outputs}
                    />
                  {:else}
                    No output
                  {/if}
                </div>
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

  .wrap {
    font-family: monospace;
    background-color: var(
      --spectrum-textfield-m-background-color,
      var(--spectrum-global-color-gray-50)
    );
    border: 1px solid var(--spectrum-global-color-gray-300);
    font-size: 12px;
    max-height: 160px; /* Adjusted max-height */
    height: 160px;
    --jsonPaddingLeft: 20px;
    --jsonborderleft: 20px;
    overflow: auto;
    overflow: overlay;
    overflow-x: hidden;
    padding-left: var(--spacing-s);
    padding-top: var(--spacing-xl);
    border-radius: 4px;
  }

  .wrap::-webkit-scrollbar {
    width: 7px; /* width of the scrollbar */
  }

  .wrap::-webkit-scrollbar-track {
    background: transparent; /* transparent track */
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
