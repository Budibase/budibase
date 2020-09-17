<script>
  import mustache from "mustache"
  import { workflowStore, backendUiStore } from "builderStore"

  export let onSelect
  export let block
  let selected

  $: selected = $workflowStore.selectedBlock?.id === block.id
  $: steps = $workflowStore.selectedWorkflow?.workflow?.definition?.steps ?? []
  $: blockIdx = steps.findIndex(step => step.id === block.id)

  function selectBlock() {
    onSelect(block)
  }

  function enrichInputs(inputs) {
    let enrichedInputs = { ...inputs, enriched: {} }
    const modelId = inputs.modelId || inputs.record?.modelId
    if (modelId) {
      enrichedInputs.enriched.model = $backendUiStore.models.find(
        model => model._id === modelId
      )
    }
    return enrichedInputs
  }

  $: inputs = enrichInputs(block.inputs)
  $: tagline = block.tagline
    .replaceAll("{{", "<b>{{")
    .replaceAll("}}", "}}</b>")
</script>

<div
  class={`block ${block.type} hoverable`}
  class:selected
  on:click={selectBlock}>
  <header>
    {#if block.type === 'TRIGGER'}
      <i class="ri-lightbulb-fill" />
      <span>When this happens...</span>
    {:else if block.type === 'ACTION'}
      <i class="ri-flashlight-fill" />
      <span>Do this...</span>
    {:else if block.type === 'LOGIC'}
      <i class="ri-pause-fill" />
      <span>Only continue if...</span>
    {/if}
    <div class="label">
      {#if block.type === 'TRIGGER'}Trigger{:else}Step {blockIdx + 1}{/if}
    </div>
  </header>
  <hr />
  <p>
    {@html mustache.render(tagline, { inputs })}
  </p>
</div>

<style>
  .block {
    width: 320px;
    padding: 20px;
    border-radius: var(--border-radius-m);
    transition: 0.3s all ease;
    box-shadow: 0 4px 30px 0 rgba(57, 60, 68, 0.08);
    background-color: var(--ink);
    font-size: 16px;
    color: var(--white);
  }
  .block.selected,
  .block:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 30px 0 rgba(57, 60, 68, 0.15);
  }

  header {
    font-size: 16px;
    font-weight: 500;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }
  header span {
    flex: 1 1 auto;
  }
  header .label {
    font-size: 14px;
    padding: var(--spacing-s);
    color: var(--grey-8);
    border-radius: var(--border-radius-m);
    background-color: var(--grey-2);
  }
  header i {
    font-size: 20px;
    margin-right: 5px;
  }

  .ACTION {
    background-color: var(--white);
    color: var(--ink);
  }

  .TRIGGER {
    background-color: var(--ink);
    color: var(--white);
  }
  .TRIGGER header .label {
    background-color: var(--grey-9);
    color: var(--grey-5);
  }

  .LOGIC {
    background-color: var(--blue-light);
    color: var(--ink);
  }

  p {
    color: inherit;
    margin-bottom: 0;
  }
</style>
