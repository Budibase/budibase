<script>
  import { Subject, Property, Section }  from './components'

  export let schema
</script>


<Subject heading="Column Overview">
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
   </Section>
</Subject>
