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
    if (columnType === "array") {
      return "https://docs.budibase.com/docs/multi-select"
    }

    return ""
  }

  $: docLink = getDocLink(columnType);

</script>

<div
  class={`tooltipContents ${supportLevelClass}`}
>
  <div class="columnName">
    {columnName}
  </div>
  <div class="divider"></div>
  <div class="line">
    <a target=”_blank” href={docLink} class="chip link">
      <Icon size="S" name={columnIcon} />
      <span>{columnType} Column</span>
    </a>
  </div>
  <div class={`line ${supportLevelClass}`}>
    <div class={`chip supportChip ${supportLevelClass}`}>
      <Icon size="S" tooltip={supportLevelIconTooltip} name={supportLevelIcon} />
      <span>{supportLevelText}</span>
    </div>
    <span>with</span>
    <div class="chip link">
      <Icon size="S" name={"GraphPie"} />
      <span>Chart Components</span>
    </div>
  </div>
      {#if warnings.includes("string number warning")}
  <div class={`line ${supportLevelClass}`}>
    <span>
        Non-numeric values will not be displayed
    </span>
  </div>
      {/if}

  <!--
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
  -->
</div>

<style>
  .columnName {
    font-style: italic;
    padding: 3px 6px;
    border-radius: 5px;
    background-color: var(--grey-2);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-block;
    max-width: 100%;
    box-sizing: border-box;
  }

  .divider {
    border-bottom: 1px solid var(--grey-4);
    margin: 6px 0 16px;
  }

  .tooltipContents {
    max-width: 400px;
    background-color: var(--background-alt);
    display: block;
    padding: 12px;
    border-radius: 5px;
    box-sizing: border-box;
  }

  .line {
    background-color: var(--background-alt);
    color: var(--ink);
    align-items: center;
    margin-bottom: 10px;
  }

  .line > span {
    display: inline;
    margin-right: 5px;
  }

  .chip {
    display: inline-flex;
    padding: 3px 6px;
    border-radius: 5px;
    vertical-align: sub;
    margin-right: 5px;
  }

  .link {
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

  .supportChip {
    color: black;
  }

  .supportChip :global(svg) {
    margin-right: 5px;
  }

  .supportChip.supportLevelUnsupported {
    background-color: var(--red)
  }

  .supportChip.supportLevelPartialSupport {
    background-color: var(--yellow)
  }

  .supportChip.supportLevelSupported {
    background-color: var(--green)
  }
</style>
