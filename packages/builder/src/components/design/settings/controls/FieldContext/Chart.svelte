<script>
  import { Icon, Heading, Multiselect, ContextTooltip } from "@budibase/bbui"
  import { getDatasourceForProvider, getSchemaForDatasource } from "dataBinding"
  import { selectedScreen } from "stores/builder"
  import { createEventDispatcher } from "svelte"
  import Property from './Property.svelte'
  import InfoWord from './InfoWord.svelte'
  import DocumentationLink from './DocumentationLink.svelte'

  export let supportLevelClass = ''
  export let supportLevelIconColor = ""
  export let supportLevelIcon = ""
  export let supportLevelIconTooltip = ""
  export let supportLevelText = ""

  export let columnIcon
  export let columnType
  export let columnName
  export let sidecar = false

  export let errors = []
  export let warnings = []
  export let tableHref = () => {}

  export let schema

  let root = null;

  const getDocLink = (columnType) => {
    if (columnType === "Number") {
      return "https://docs.budibase.com/docs/number"
    }
    if (columnType === "Text") {
      return "https://docs.budibase.com/docs/text"
    }
    if (columnType === "Attachment") {
      return "https://docs.budibase.com/docs/attachments"
    }
    if (columnType === "Multi-select") {
      return "https://docs.budibase.com/docs/multi-select"
    }
    if (columnType === "JSON") {
      return "https://docs.budibase.com/docs/json"
    }
    if (columnType === "Date/Time") {
      return "https://docs.budibase.com/docs/datetime"
    }
    if (columnType === "User") {
      return "https://docs.budibase.com/docs/user"
    }

    return ""
  }

  $: docLink = getDocLink(columnType);

  let sidecarSubject = null

  const handleMouseenter = (option, idx) => {
    sidecarSubject = option;
    root = root
  }

  const handleMouseleave = (option) => {
    sidecarSubject = null;
  }

</script>

<div
  bind:this={root}
  class={`tooltipContents ${supportLevelClass}`}
>

  <div class="line topLine">
    <span class="bullet">•</span>
    <InfoWord
      on:mouseenter={() => handleMouseenter("column")}
      on:mouseleave={() => handleMouseleave("column")}
      href={tableHref}
      text={columnName}
    />
    <span class="space" />
    <span class="text"> is a </span>
    <span class="space" />
    <DocumentationLink
      href={docLink}
      icon={columnIcon}
      text={`${columnType} column`}
    />
    <span class="period">.</span>
  </div>
  <div class={`line ${supportLevelClass}`}>
    <span class="bullet">•</span>
    <InfoWord
      on:mouseenter={() => handleMouseenter("support")}
      on:mouseleave={() => handleMouseleave("support")}
      icon={supportLevelIcon}
      color={supportLevelIconColor}
      text={supportLevelText}
    />
    <span class="space" />
    <span class="text">with</span>
    <span class="space" />
    <DocumentationLink
      href="https://docs.budibase.com/docs/chart"
      icon="GraphPie"
      text="Chart components"
    />
    <span class="period">.</span>
  </div>
  {#if warnings.includes("string number warning")}
    <div class={`line`}>
      <span class="bullet">•</span>
      <span class="text">Any</span>
    <span class="space" />
    <InfoWord
      on:mouseenter={() => handleMouseenter("stringsAndNumbers")}
      on:mouseleave={() => handleMouseleave("stringsAndNumbers")}
      text="non-number-values"
    />
    <span class="space" />
      <span class="text">
        will be ignored
      </span>
      <span class="period">.</span>
    </div>
  {/if}
  {#if warnings.includes("optional warning")}
    <div class={`line`}>
      <span class="bullet">•</span>
      <span class="text">No</span>
    <span class="space" />
    <InfoWord
      on:mouseenter={() => handleMouseenter("required")}
      on:mouseleave={() => handleMouseleave("required")}
      text="required"
    />
    <span class="space" />
      <a target="_blank" rel="noopener noreferrer" href={"https://docs.budibase.com/docs/budibasedb#constraints"} class="chip link topLink">
        <Icon size="S" name={"DataUnavailable"} />
        <span class="text">
          Constraint
        </span></a><span class="comma">,</span>
      <span class="text">
        so values may be missing
      </span>
      <span class="period">.</span>
    </div>
  {/if}
</div>

{#if sidecar}
  <ContextTooltip
    noAnimation
    visible={sidecarSubject !== null}
    anchor={root}
    offset={20}
  >
  <div class="sidecarContent">
    {#if sidecarSubject === "column"}
      <div class="heading wrapper">
      <span class="heading">{columnName}</span>
      </div>
      <div class="divider" />
      <div class="section">
        {#if schema.type === "string"}
          <Property
            name="Max Length"
            value={schema?.constraints?.length?.maximum ?? "None"}
          />
        {:else if schema.type === "datetime"}
          <Property
            name="Earliest"
            value={schema?.constraints?.datetime?.earliest === "" ? "None" : schema?.constraints?.datetime?.earliest}
          />
          <Property
            name="Latest"
            value={schema?.constraints?.datetime?.latest === "" ? "None" : schema?.constraints?.datetime?.latest}
          />
          <Property
            name="Ignore time zones"
            value={schema?.ignoreTimeZones === true ? "Yes" : "No"}
          />
          <Property
            name="Date only"
            value={schema?.dateOnly === true ? "Yes" : "No"}
          />
        {:else if schema.type === "number"}
          <Property
            name="Min Value"
            value={schema?.constraints?.numericality?.greaterThanOrEqualTo === "" ? "None" : schema?.constraints?.numericality?.greaterThanOrEqualTo}
          />
          <Property
            name="Max Value"
            value={schema?.constraints?.numericality?.lessThanOrEqualTo === "" ? "None" : schema?.constraints?.numericality?.lessThanOrEqualTo}
          />
        {:else if schema.type === "json"}
          <Property
            pre
            name="Schema"
            value={JSON.stringify(schema?.schema ?? {}, null, 2)}
          />
        {/if}
        <Property
          name="Required"
          value={schema?.constraints?.presence?.allowEmpty === false ? "Yes" : "No"}
        />
      </div>
    {:else if sidecarSubject === "support"}
        <span class="heading">Data/Component Compatibility</span>
        <div class="divider" />
        <div class="section">
          <InfoWord
            icon="CheckmarkCircle"
            color="var(--green)"
            text="Compatible"
          />
          <span class="body">Fully compatible with the component as long as the data is present.</span>
        </div>
        <div class="section">
          <InfoWord
            icon="AlertCheck"
            color="var(--yellow)"
            text="Possibly compatible"
          />
          <span class="body">Possibly compatible with the component, but beware of other caveats mentioned in the context tooltip.</span>
        </div>
        <div class="section">
          <InfoWord
            icon="Alert"
            color="var(--red)"
            text="Not compatible"
          />
          <span class="body">Imcompatible with the component.</span>
        </div>


    {:else if sidecarSubject === "stringsAndNumbers"}
      <span class="heading">Text as Numbers</span>
      <div class="divider" />
      <div class="section">
        Text can be used in place of numbers in certain scenarios, but care needs to be taken to ensure that non-numerical values aren't also present, otherwise they may be parsed incorrectly and lead to unexpected behavior.
      </div>
    {:else if sidecarSubject === "required"}
      <span class="heading">'Required' Constraint</span>
      <div class="divider" />
      <div class="section">
        <span class="body">A 'required' contraint can be applied to columns to ensure a value is always present. If a column doesn't have this constraint, then its value for a particular row could he missing.</span>
      </div>
    {/if}
  </div>
  </ContextTooltip>
{/if}

<style>
  .text {
    flex-shrink: 0;
  }

  .sidecarContent {
    max-width: 300px;
    padding: 16px 12px 18px;
  }

  .heading {
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .section {
    margin-bottom: 16px;
  }
  .section:last-child {
    margin-bottom: 16px;
  }

  .section .body {
    display: block;
    margin-top: 5px;
  }

  /* BETWEEN STUFF */
  /* BETWEEN STUFF */
  /* BETWEEN STUFF */

  .tooltipContents {
    max-width: 450px;
    background-color: var(--background-alt);
    display: block;
    padding: 20px 16px;
    border-radius: 5px;
    box-sizing: border-box;
  }

  .columnName {
    vertical-align: baseline;
    background-color: var(--grey-3);
    display: block;
    font-style: italic;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    box-sizing: border-box;
    flex-grow: 0;
    flex-shrink: 1;
    min-width: 0;
    color: var(--grey-8);
  }

  .bullet {
    color: var(--grey-5);
    font-size: 17px;
    display: inline block;
    margin-right: 10px;
  }

  .period {
    color: var(--grey-5);
    font-size: 20px;
    display: inline block;
    margin-left: 3px;
  }

  .comma {
    color: var(--grey-5);
    font-size: 20px;
    display: inline block;
    margin-right: 5px;
  }

  .semiColon {
    color: var(--grey-5);
    font-size: 16px;
    display: inline block;
  }

  .space {
    margin-right: 5px;
  }

  .divider {
    border-bottom: 1px solid var(--grey-4);
    margin: 12px 0 12px;
  }


  .topLine {
    display: flex;
    align-items: center;
  }

  .topLine .space {
  }

  .chip {
    box-sizing: border-box;
    display: inline-flex;
    padding: 3px 6px;
    border-radius: 5px;
    vertical-align: sub;
    filter: brightness(100%);
  }

  .chip:hover {
    filter: brightness(120%);
    transition: filter 300ms
  }

  .chip :global(svg) {
    color:  var(--grey-6);
  }

  .topLine .period {
    flex-shrink: 0;
  }

  .topLine .bullet {
    flex-shrink: 0;
  }

  .topLink {
    flex-shrink: 0;
    margin-right: 2px;
  }

  .line {
    background-color: var(--background-alt);
    color: var(--ink);
    align-items: center;
    display: flex;

    margin-bottom: 10px;
  }

  .line:last-child {
    margin-bottom: 0px;
  }

  .link {
    border-radius: 0;
    background-color: transparent;
    border: 1px solid red;
    border-width: 0 0 1px 0;
    box-sizing: border-box;
    border-color: var(--blue);
    color: white;
    padding-left: 0px;
    padding-right: 0px;
    transition: background-color 200ms;
  }

  .link:hover {
    cursor: pointer;
    background-color: #ffffff0a;
  }

  .info {

    vertical-align: baseline;
    background-color: var(--grey-3);
  }

  .info :global(svg) {
    margin-right: 3px;
  }


  .link :global(svg) {
    margin-right: 3px;
    color: var(--blue);
  }

  .supportChip {
    background-color: var(--grey-3);
    color: var(--ink);
    border: 1px solid red;
    box-sizing: border-box;
  }

  .supportChip :global(svg) {
    margin-right: 5px;
  }

  .supportChip.supportLevelUnsupported {
    border-color: var(--red);
  }

  .supportChip.supportLevelUnsupported :global(svg) {
    color: var(--red);
  }

  .supportChip.supportLevelPartialSupport {
    border-color: var(--yellow);
  }

  .supportChip.supportLevelPartialSupport :global(svg) {
    color: var(--yellow);
  }

  .supportChip.supportLevelSupported {
    border-color: var(--green);
  }

  .supportChip.supportLevelSupported :global(svg) {
    color: var(--green);
  }
</style>
