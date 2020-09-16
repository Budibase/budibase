<script>
  import mustache from "mustache"
  import { workflowStore, backendUiStore } from "builderStore"

  export let onSelect
  export let block
  let selected

  $: selected =
    $workflowStore.selectedBlock != null &&
    $workflowStore.selectedBlock.id === block.id

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

<div class={`${block.type} hoverable`} class:selected on:click={selectBlock}>
  <header>
    {#if block.type === 'TRIGGER'}
      <i class="ri-lightbulb-fill" />
      When this happens...
    {:else if block.type === 'ACTION'}
      <i class="ri-flashlight-fill" />
      Do this...
    {:else if block.type === 'LOGIC'}
      <i class="ri-pause-fill" />
      Only continue if...
    {/if}
  </header>
  <hr />
  <p>
    {@html mustache.render(tagline, { inputs })}
  </p>
</div>

<style>
  div {
    width: 320px;
    padding: 20px;
    border-radius: var(--border-radius-m);
    transition: 0.3s all ease;
    box-shadow: 0 4px 30px 0 rgba(57, 60, 68, 0.08);
    background-color: var(--ink);
    font-size: 16px;
    color: var(--white);
  }

  header {
    font-size: 16px;
    font-weight: 500;
    display: flex;
    align-items: center;
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

  .LOGIC {
    background-color: var(--blue-light);
    color: var(--ink);
  }

  p {
    color: inherit;
    margin-bottom: 0;
  }

  div.selected,
  div:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 30px 0 rgba(57, 60, 68, 0.15);
  }
</style>
