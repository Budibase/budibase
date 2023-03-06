<script>
  import { automationStore } from "builderStore"
  import { Icon, Body, Detail, StatusLight } from "@budibase/bbui"
  import { externalActions } from "./ExternalActions"
  import { createEventDispatcher } from "svelte"

  export let block
  export let open
  export let showTestStatus = false
  export let testResult
  export let isTrigger
  export let idx

  const dispatch = createEventDispatcher()

  $: {
    if (!testResult) {
      testResult = $automationStore.testResults?.steps?.filter(step =>
        block.id ? step.id === block.id : step.stepId === block.stepId
      )?.[0]
    }
  }
  $: isTrigger = isTrigger || block.type === "TRIGGER"
  $: status = updateStatus(testResult, isTrigger)

  async function onSelect(block) {
    await automationStore.update(state => {
      state.selectedBlock = block
      return state
    })
  }

  function updateStatus(results, isTrigger) {
    if (!results) {
      return {}
    }
    const lcStatus = results.outputs?.status?.toLowerCase()
    if (lcStatus === "stopped" || lcStatus === "stopped_error") {
      return { yellow: true, message: "Stopped" }
    } else if (results.outputs?.success || isTrigger) {
      return { positive: true, message: "Success" }
    } else {
      return { negative: true, message: "Error" }
    }
  }
</script>

<div class="blockSection">
  <div on:click={() => dispatch("toggle")} class="splitHeader">
    <div class="center-items">
      {#if externalActions[block.stepId]}
        <img
          alt={externalActions[block.stepId].name}
          width="28px"
          height="28px"
          src={externalActions[block.stepId].icon}
        />
      {:else}
        <svg
          width="28px"
          height="28px"
          class="spectrum-Icon"
          style="color:var(--spectrum-global-color-gray-700);"
          focusable="false"
        >
          <use xlink:href="#spectrum-icon-18-{block.icon}" />
        </svg>
      {/if}
      <div class="iconAlign">
        {#if isTrigger}
          <Body size="XS"><b>Trigger</b></Body>
          <Body size="XS">When this happens:</Body>
        {:else}
          <Body size="XS"><b>Step {idx}</b></Body>
          <Body size="XS">Do this:</Body>
        {/if}
        <Detail size="S">{block?.name?.toUpperCase() || ""}</Detail>
      </div>
    </div>
    <div class="blockTitle">
      {#if showTestStatus && testResult}
        <div style="float: right;">
          <StatusLight
            positive={status?.positive}
            yellow={status?.yellow}
            negative={status?.negative}
            ><Body size="XS">{status?.message}</Body></StatusLight
          >
        </div>
      {/if}
      <div
        style="margin-left: 10px; margin-bottom: var(--spacing-xs);"
        on:click={() => {
          onSelect(block)
        }}
      >
        <Icon hoverable name={open ? "ChevronUp" : "ChevronDown"} />
      </div>
    </div>
  </div>
</div>

<style>
  .center-items {
    display: flex;
    align-items: center;
  }
  .splitHeader {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .iconAlign {
    padding: 0 0 0 var(--spacing-m);
    display: inline-block;
  }

  .blockSection {
    padding: var(--spacing-xl);
  }

  .blockTitle {
    display: flex;
    align-items: center;
  }
</style>
