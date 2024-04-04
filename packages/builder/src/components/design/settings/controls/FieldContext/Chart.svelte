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
  export let columnType
  export let columnName

  export let errors = []
  export let warnings = []

  const getDocLink = (columnType) => {
    if (columnType === "number") {
      return "https://docs.budibase.com/docs/number"
    }
    if (columnType === "string") {
      return "https://docs.budibase.com/docs/text"
    }
    if (columnType === "attachment") {
      return "https://docs.budibase.com/docs/attachments"
    }

    return ""
  }

  $: docLink = getDocLink(columnType);

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
      <span class="columnName">
        {columnName}
      </span><span> is a </span>
      <a target=”_blank” href={docLink} class="link">
        <Icon name={columnIcon} />
        <span>{columnType}</span>
      </a>
      <span>column.</span>
    </div>

    {#if errors.length > 0}
      {#each errors as datum}
        <p>{datum}</p>
      {/each}
    {:else if warnings.length > 0}
      {#each warnings as datum}
        <p>{datum}</p>
      {/each}
    {:else}
        <p>{supportLevelIconTooltip}</p>
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
    row-gap: 6px;
    column-gap: 5px;
    background-color: var(--background-alt);
    color: var(--ink);
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    padding: 6px 8px;
    border-width: var(--spectrum-actionbutton-border-size);
    border-radius: var(--spectrum-alias-border-radius-regular);
    border: 1px solid
      var(
        --spectrum-actionbutton-m-border-color,
        var(--spectrum-alias-border-color)
      );
  }

  .contextTooltipContent {
    color: var(--ink);
    margin: 0px 12px;
    color: black;
  }

  .contextTooltipContent > p {
  }

  .columnName {
    padding: 3px 6px;
    border-radius: 5px;
    background-color: var(--grey-3);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .link {
    display: inline-flex;
    padding: 3px 6px;
    border-radius: 5px;
    background-color: var(--spectrum-global-color-blue-500);
    color: white;
    transition: background-color 300ms
  }

  .link:hover {
    background-color: var(--spectrum-global-color-blue-700);
    cursor: pointer;
  }

  .link :global(svg) {
    margin-right: 3px;
  }

  .link :global(span) {
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
