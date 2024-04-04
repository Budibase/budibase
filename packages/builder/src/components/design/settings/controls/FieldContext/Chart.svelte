<script>
  import { Icon, Heading, Multiselect, ContextTooltip } from "@budibase/bbui"
  import { getDatasourceForProvider, getSchemaForDatasource } from "dataBinding"
  import { selectedScreen } from "stores/builder"
  import { createEventDispatcher } from "svelte"

  export let supportLevelClass = ''
  export let supportLevelIcon = ""
  export let supportLevelIconTooltip = ""
  export let supportLevelText = ""

  export let columnIcon
  export let columnName

  export let errors = []
  export let warnings = []

</script>

<div
  class={`tooltipContents ${supportLevelClass}`}
>
  <div class={`supportLevel ${supportLevelClass}`}>
    <Icon tooltip={supportLevelIconTooltip} name={supportLevelIcon} />
    <p>{supportLevelText}</p>
  </div>
  <div class="contextTooltipContent">
    <div class="contextTooltipHeader">
      <Icon name={columnIcon} />
      <span>{columnName}</span>
    </div>

    {#if errors.length > 0}
      {#each errors as datum}
        <p>{datum}</p>
      {/each}
    {:else if warnings.length > 0}
      {#each warnings as datum}
        <p>{datum}</p>
      {/each}
    {/if}
  </div>
</div>

<style>
  .tooltipContents {
    max-width: 400px;
    background-color: var(--spectrum-global-color-gray-200);
    display: block;
    padding: 0 0 12px 0 ;
    border-radius: 5px;
    box-sizing: border-box;
  }

  .tooltipContents.supportLevelUnsupported {
    background-color: var(--red);
    color: var(--ink)
  }

  .tooltipContents.supportLevelPartialSupport {
    background-color: var(--yellow);
    color: var(--ink)
  }

  .tooltipContents.supportLevelSupported {
    background-color: var(--green);
    color: var(--ink)
  }

  .contextTooltipHeader {
    background-color: var(--background-alt);
    color: var(--ink);
    display: flex;
    align-items: center;
    height: var(--spectrum-alias-item-height-m);
    padding: 0px var(--spectrum-alias-item-padding-m);
    border-width: var(--spectrum-actionbutton-border-size);
    border-radius: var(--spectrum-alias-border-radius-regular);
    border: 1px solid
      var(
        --spectrum-actionbutton-m-border-color,
        var(--spectrum-alias-border-color)
      );
  }

  .contextTooltipContent {
    padding: 0px 12px;
    color: black;
  }

  .contextTooltipHeader :global(svg) {
    margin-right: 5px;
  }

  .contextTooltipHeader :global(span) {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .supportLevel {
    display: flex;
    align-items: center;
    height: var(--spectrum-alias-item-height-m);
    padding: 0px var(--spectrum-alias-item-padding-m);
    margin-bottom: 12px;
    color: black;
  }
  .supportLevel :global(svg) {
    margin-right: 5px;
  }

  .supportLevel.supportLevelUnsupported {
    background-color: var(--red-light)
  }

  .supportLevel.supportLevelPartialSupport {
    background-color: var(--yellow-light)
  }

  .supportLevel.supportLevelSupported {
    background-color: var(--green-light)
  }
</style>
