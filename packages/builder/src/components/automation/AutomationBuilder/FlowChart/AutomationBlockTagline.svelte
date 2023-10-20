<script>
  import { processStringSync } from "@budibase/string-templates"
  import { get } from "lodash/fp"
  import { tables } from "stores/backend"

  export let block

  $: inputs = enrichInputs(block.inputs)
  $: tagline = formatTagline(block.tagline, block.schema, inputs)
  $: html = (tagline || "")
    .replace(/{{\s*/g, "<span>")
    .replace(/\s*}}/g, "</span>")

  function enrichInputs(inputs) {
    let enrichedInputs = { ...inputs, enriched: {} }
    const tableId = inputs.tableId || inputs.row?.tableId
    if (tableId) {
      enrichedInputs.enriched.table = $tables.list.find(
        table => table._id === tableId
      )
    }
    return enrichedInputs
  }

  function formatTagline(tagline, schema, inputs) {
    // Add bold tags around inputs
    let formattedTagline = tagline
      .replace(/{{/g, "<b>{{")
      .replace(/}}/, "}}</b>")

    // Extract schema paths for any input bindings
    let inputPaths = formattedTagline.match(/{{\s*\S+\s*}}/g) || []
    inputPaths = inputPaths.map(path => path.replace(/[{}]/g, "").trim())
    const schemaPaths = inputPaths.map(path =>
      path.replace(/\./g, ".properties.")
    )

    // Replace any enum bindings with their pretty equivalents
    schemaPaths.forEach((path, idx) => {
      const prettyValues = get(`${path}.pretty`, schema)
      if (prettyValues) {
        const enumValues = get(`${path}.enum`, schema)
        const inputPath = inputPaths[idx]
        const value = get(inputPath, { inputs })
        const valueIdx = enumValues.indexOf(value)
        const prettyValue = prettyValues[valueIdx]
        if (prettyValue == null) {
          return
        }
        formattedTagline = formattedTagline.replace(
          new RegExp(`{{\\s*${inputPath}\\s*}}`),
          prettyValue
        )
      }
    })

    // Fill in bindings with templating library
    return processStringSync(formattedTagline, { inputs })
  }
</script>

<div>
  <!-- eslint-disable-next-line svelte/no-at-html-tags-->
  {@html html}
</div>

<style>
  div {
    line-height: 1.25;
  }
  div :global(span) {
    font-size: 0.9em;
    background-color: var(--purple-light);
    padding: var(--spacing-xs);
    border-radius: var(--border-radius-m);
    display: inline-block;
    margin: 1px;
  }
</style>
