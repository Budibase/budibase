<script>
  import StringRenderer from "./StringRenderer.svelte"
  import BooleanRenderer from "./BooleanRenderer.svelte"
  import DateTimeRenderer from "./DateTimeRenderer.svelte"
  import RelationshipRenderer from "./RelationshipRenderer.svelte"
  import AttachmentRenderer from "./AttachmentRenderer.svelte"
  import ArrayRenderer from "./ArrayRenderer.svelte"
  import InternalRenderer from "./InternalRenderer.svelte"
  import { processStringSync } from "@budibase/string-templates"

  export let row
  export let schema
  export let value
  export let customRenderers = []
  export let snippets

  let renderer
  const typeMap = {
    boolean: BooleanRenderer,
    datetime: DateTimeRenderer,
    link: RelationshipRenderer,
    attachment: AttachmentRenderer,
    string: StringRenderer,
    options: StringRenderer,
    number: StringRenderer,
    longform: StringRenderer,
    array: ArrayRenderer,
    internal: InternalRenderer,
    bb_reference: RelationshipRenderer,
  }
  $: type = getType(schema)
  $: customRenderer = customRenderers?.find(x => x.column === schema?.name)
  $: renderer = customRenderer?.component ?? typeMap[type] ?? StringRenderer
  $: cellValue = getCellValue(value, schema.template)

  const getType = schema => {
    // Use a string renderer for dates if we use a custom template
    if (schema?.type === "datetime" && schema?.template) {
      return "string"
    }
    return schema?.type || "string"
  }

  const getCellValue = (value, template) => {
    if (!template) {
      return value
    }
    return processStringSync(template, { value, snippets })
  }
</script>

{#if renderer && (customRenderer || (cellValue != null && cellValue !== ""))}
  <div style="--max-cell-width: {schema.width ? 'none' : '200px'};">
    <svelte:component
      this={renderer}
      {row}
      {schema}
      value={cellValue}
      on:clickrelationship
      on:buttonclick
    >
      <slot />
    </svelte:component>
  </div>
{/if}

<style>
  div {
    display: contents;
  }
</style>
