<script>
  import { Icon, Heading, Multiselect, ContextTooltip } from "@budibase/bbui"
  import { getDatasourceForProvider, getSchemaForDatasource } from "dataBinding"
  import { selectedScreen } from "stores/builder"
  import { createEventDispatcher } from "svelte"
  import Property from './Property.svelte'
  import InfoWord from '../InfoWord.svelte'

  export let anchor
  export let schema
  export let subject = null
</script>


<ContextTooltip
  noAnimation
  visible={subject !== null}
  {anchor}
  offset={20}
>
<div class="explanationModalContent">
  {#if subject === "column"}
    <div class="heading wrapper">
    <span class="heading">Column Overview</span>
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
  {:else if subject === "support"}
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


  {:else if subject === "stringsAndNumbers"}
    <span class="heading">Text as Numbers</span>
    <div class="divider" />
    <div class="section">
      Text can be used in place of numbers in certain scenarios, but care needs to be taken to ensure that non-numerical values aren't also present, otherwise they may be parsed incorrectly and lead to unexpected behavior.
    </div>
  {:else if subject === "required"}
    <span class="heading">'Required' Constraint</span>
    <div class="divider" />
    <div class="section">
      <span class="body">A 'required' contraint can be applied to columns to ensure a value is always present. If a column doesn't have this constraint, then its value for a particular row could he missing.</span>
    </div>
  {/if}
</div>
</ContextTooltip>

<style>
  .explanationModalContent {
    max-width: 300px;
    padding: 16px 12px 18px;
  }

  .heading {
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .divider {
    border-bottom: 1px solid var(--grey-4);
    margin: 12px 0 12px;
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
</style>
