<script>
  import { tables } from "@/stores/builder"
  import {
    BindingValue,
    Block,
    Subject,
    JSONValue,
    Property,
    Section,
  } from "./components"

  export let schema
  export let columnName

  const parseDate = isoString => {
    if ([null, undefined, ""].includes(isoString)) {
      return "None"
    }

    const unixTime = Date.parse(isoString)
    const date = new Date(unixTime)

    return date.toLocaleString()
  }
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
        value={parseDate(schema?.constraints?.datetime?.earliest)}
      />
      <Property
        name="Latest"
        value={parseDate(schema?.constraints?.datetime?.latest)}
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
        value={[null, undefined, ""].includes(
          schema?.constraints?.numericality?.greaterThanOrEqualTo
        )
          ? "None"
          : schema?.constraints?.numericality?.greaterThanOrEqualTo}
      />
      <Property
        name="Max Value"
        value={[null, undefined, ""].includes(
          schema?.constraints?.numericality?.lessThanOrEqualTo
        )
          ? "None"
          : schema?.constraints?.numericality?.lessThanOrEqualTo}
      />
    {:else if schema.type === "array"}
      {#each schema?.constraints?.inclusion ?? [] as option, index}
        <Property name={`Option ${index + 1}`} truncate>
          <span
            style:background-color={schema?.optionColors?.[option]}
            class="optionCircle"
          />{option}
        </Property>
      {/each}
    {:else if schema.type === "options"}
      {#each schema?.constraints?.inclusion ?? [] as option, index}
        <Property name={`Option ${index + 1}`} truncate>
          <span
            style:background-color={schema?.optionColors?.[option]}
            class="optionCircle"
          />{option}
        </Property>
      {/each}
    {:else if schema.type === "json"}
      <Property name="Schema">
        <JSONValue value={JSON.stringify(schema?.schema ?? {}, null, 2)} />
      </Property>
    {:else if schema.type === "formula"}
      <Property name="Formula">
        <BindingValue value={schema?.formula} />
      </Property>
      <Property
        name="Formula type"
        value={schema?.formulaType === "dynamic" ? "Dynamic" : "Static"}
      />
    {:else if schema.type === "link"}
      <Property name="Type" value={schema?.relationshipType} />
      <Property
        name="Related Table"
        value={$tables?.list?.find(table => table._id === schema?.tableId)
          ?.name}
      />
      <Property name="Column in Related Table" value={schema?.fieldName} />
    {:else if schema.type === "bb_reference"}
      <Property
        name="Allow multiple users"
        value={schema?.relationshipType === "many-to-many" ? "Yes" : "No"}
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
