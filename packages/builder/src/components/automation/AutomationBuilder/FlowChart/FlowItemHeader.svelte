<script>
  import { Detail, Icon, Body, StatusLight, Modal } from "@budibase/bbui"
  import { externalActions } from "./ExternalActions"
  import ResultsModal from "./ResultsModal.svelte"

  export let onSelect
  export let block
  export let results
  export let useResultsModal = true
  export let open

  $: isTrigger = block?.type === "TRIGGER"

  let resultsModal
</script>

<div class="blockSection">
  <div
    on:click={() => {
      open = !open
    }}
    class="splitHeader"
  >
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
          style="color:grey;"
          focusable="false"
        >
          <use xlink:href="#spectrum-icon-18-{block.icon}" />
        </svg>
      {/if}
      <div class="iconAlign">
        {#if isTrigger}
          <Body size="XS">When this happens:</Body>
        {:else}
          <Body size="XS">Do this:</Body>
        {/if}

        <Detail size="S">{block?.name?.toUpperCase() || ""}</Detail>
      </div>
    </div>
    <div class="blockTitle">
      {#if useResultsModal}
        {#if results && results[0]}
          <div style="float: right;" on:click={() => resultsModal.show()}>
            <StatusLight
              positive={isTrigger || results[0].outputs?.success}
              negative={!results[0].outputs?.success}
              ><Body size="XS">View response</Body></StatusLight
            >
          </div>
        {/if}
      {:else}
        <slot />
      {/if}
      <div
        style="margin-left: 10px;"
        on:click={() => {
          onSelect(block)
        }}
      >
        <Icon name={open ? "ChevronDown" : "ChevronUp"} />
      </div>
    </div>
  </div>
</div>

{#if useResultsModal}
  <Modal bind:this={resultsModal} width="30%">
    <ResultsModal {isTrigger} bind:testResult={results} />
  </Modal>
{/if}

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
