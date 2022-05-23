<script>
  import { Icon, Divider, Tabs, Tab, TextArea, Label } from "@budibase/bbui"
  import FlowItemHeader from "./FlowChart/FlowItemHeader.svelte"
  import { automationStore } from "builderStore"

  export let automation

  let showParameters
  let blocks

  $: {
    blocks = []
    if (automation) {
      if (automation.definition.trigger) {
        blocks.push(automation.definition.trigger)
      }
      blocks = blocks
        .concat(automation.definition.steps || [])
        .filter(x => x.stepId !== "LOOP")
    }
  }

  $: testResults =
    $automationStore.selectedAutomation?.testResults?.steps.filter(
      x => x.stepId !== "LOOP" || []
    )
</script>

<div class="title">
  <div class="title-text">
    <Icon name="MultipleCheck" />
    <div style="padding-left: var(--spacing-l)">Test Details</div>
  </div>
  <div style="padding-right: var(--spacing-xl)">
    <Icon
      on:click={async () => {
        $automationStore.selectedAutomation.automation.showTestPanel = false
      }}
      hoverable
      name="Close"
    />
  </div>
</div>

<Divider />

<div class="container">
  {#each blocks as block, idx}
    <div class="block">
      {#if block.stepId !== "LOOP"}
        <FlowItemHeader showTestStatus={true} bind:showParameters {block} />
        {#if showParameters && showParameters[block.id]}
          <Divider noMargin />
          {#if testResults?.[idx]?.outputs.iterations}
            <div style="display: flex; padding: 10px 10px 0px 12px;">
              <Icon name="Reuse" />
              <div style="margin-left: 10px;">
                <Label>
                  This loop ran {testResults?.[idx]?.outputs.iterations} times.</Label
                >
              </div>
            </div>
          {/if}

          <div class="tabs">
            <Tabs quiet noPadding selected="Input">
              <Tab title="Input">
                <div style="padding: 10px 10px 10px 10px;">
                  <TextArea
                    minHeight="80px"
                    disabled
                    value={JSON.stringify(testResults?.[idx]?.inputs, null, 2)}
                  />
                </div></Tab
              >
              <Tab title="Output">
                <div style="padding: 10px 10px 10px 10px;">
                  <TextArea
                    minHeight="100px"
                    disabled
                    value={JSON.stringify(testResults?.[idx]?.outputs, null, 2)}
                  />
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
    padding: 0px 30px 0px 30px;
  }
  .title {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: var(--spacing-xs);
    padding-left: var(--spacing-xl);
    justify-content: space-between;
  }

  .tabs {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    position: relative;
    flex: 1 1 auto;
  }

  .title-text {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .title :global(h1) {
    flex: 1 1 auto;
  }

  .block {
    display: inline-block;
    width: 400px;
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
