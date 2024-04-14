<script>
  import { Block, Subject, JSONProperty, Property, Section }  from './components'

  export let schema
  export let columnName
</script>


<Subject>
  <div class="heading" slot="heading">
    Column Overview for <Block>{columnName}</Block>
  </div>
  <Section>
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
      value={[null, undefined, ""].includes(schema?.constraints?.numericality?.greaterThanOrEqualTo) ? "None" : schema?.constraints?.numericality?.greaterThanOrEqualTo}
    />
    <Property
      name="Max Value"
      value={[null, undefined, ""].includes(schema?.constraints?.numericality?.lessThanOrEqualTo)? "None" : schema?.constraints?.numericality?.lessThanOrEqualTo}
    />
  {:else if schema.type === "array"}

    {#each (schema?.constraints?.inclusion ?? []) as option, index}
      <Property
        name={`Option ${index + 1}`}
        truncate
      >
      <span style:background-color={schema?.optionColors?.[option]} class="optionCircle" />{option}
      </Property>
    {/each}
  {:else if schema.type === "options"}
    {#each (schema?.constraints?.inclusion ?? []) as option, index}
      <Property
        name={`Option ${index + 1}`}
        truncate
      >
      <span style:background-color={schema?.optionColors?.[option]} class="optionCircle" />{option}
      </Property>
    {/each}
  {:else if schema.type === "json"}
    <JSONProperty
      name="Schema"
      value={JSON.stringify(schema?.schema ?? {}, null, 2)}
    />
  {/if}
  <Property
    name="Required"
    value={schema?.constraints?.presence?.allowEmpty === false ? "Yes" : "No"}
   />
   </Section>
</Subject>

<style>
  .heading {
    display: flex;
    align-items: center;
  }

  .heading > :global(.block) {
    margin-left: 4px;
    flex-grow: 0;
    flex-shrink: 1;
    display: inline-block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .optionCircle {
    display: inline-block;
    background-color: hsla(0, 1%, 50%, 0.3);
    border-radius: 100%;
    width: 10px;
    height: 10px;
    vertical-align: middle;
    margin-right: 5px;
  }
</style>
