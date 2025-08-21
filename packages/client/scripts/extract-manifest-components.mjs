#!/usr/bin/env node

import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Read manifest.json to extract component keys
const manifest = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../manifest.json"), "utf8")
)

// Extract component keys (excluding features and typeSupportPresets)
const componentKeys = Object.keys(manifest).filter(
  key => !["features", "typeSupportPresets"].includes(key)
)

// Read the app/index.js to get the actual exports
const appIndexContent = fs.readFileSync(
  path.join(__dirname, "../src/components/app/index.js"),
  "utf8"
)

// Extract export mappings from app/index.js
const exportRegex = /export \{ default as (\w+) \} from "\.\/(.+)"/g
const exportMappings = {}
let match

while ((match = exportRegex.exec(appIndexContent)) !== null) {
  const [, exportName, filePath] = match
  exportMappings[exportName] = `app/${filePath}`
}

// Manual mappings for special cases and sub-exports
const manualMappings = {
  // Charts (exported from "./charts")
  bar: "app/charts/BarChart.svelte",
  line: "app/charts/LineChart.svelte",
  area: "app/charts/AreaChart.svelte", 
  pie: "app/charts/PieChart.svelte",
  donut: "app/charts/DonutChart.svelte",
  candlestick: "app/charts/CandleStickChart.svelte",
  histogram: "app/charts/HistogramChart.svelte",

  // Forms (exported from "./forms")
  form: "app/forms/Form.svelte",
  formstep: "app/forms/FormStep.svelte",
  fieldgroup: "app/forms/FieldGroup.svelte",
  stringfield: "app/forms/StringField.svelte",
  numberfield: "app/forms/NumberField.svelte",
  bigintfield: "app/forms/BigIntField.svelte",
  passwordfield: "app/forms/PasswordField.svelte",
  optionsfield: "app/forms/OptionsField.svelte",
  multifieldselect: "app/forms/MultiFieldSelect.svelte",
  booleanfield: "app/forms/BooleanField.svelte",
  longformfield: "app/forms/LongFormField.svelte",
  datetimefield: "app/forms/DateTimeField.svelte",
  codescanner: "app/forms/CodeScannerField.svelte",
  attachmentfield: "app/forms/AttachmentField.svelte",
  attachmentsinglefield: "app/forms/AttachmentSingleField.svelte",
  relationshipfield: "app/forms/RelationshipField.svelte",
  jsonfield: "app/forms/JSONField.svelte",
  s3upload: "app/forms/S3Upload.svelte",
  bbreferencefield: "app/forms/BBReferenceField.svelte",
  bbreferencesinglefield: "app/forms/BBReferenceSingleField.svelte",
  ratingfield: "app/forms/RatingField.svelte",
  signaturesinglefield: "app/forms/SignatureField.svelte",
  labelfield: "app/forms/Field.svelte",

  // Blocks (exported from "./blocks")
  chartblock: "app/blocks/ChartBlock.svelte",
  cardsblock: "app/blocks/CardsBlock.svelte",
  repeaterblock: "app/blocks/RepeaterBlock.svelte",
  multistepformblock: "app/blocks/MultiStepFormblock.svelte",
  formblock: "app/blocks/form/FormBlock.svelte",
  rowexplorer: "app/blocks/RowExplorer.svelte",

  // Dynamic filter (exported from "./dynamic-filter")
  dynamicfilter: "app/dynamic-filter/DynamicFilter.svelte",

  // PDF (exported from "./pdf")
  pdf: "app/pdf/PDF.svelte",
  pdftable: "app/pdf/PDFTable.svelte",

  // Table (exported from "./deprecated/table")
  table: "app/deprecated/table/Table.svelte",

  // Filter components - filterconfig points to FilterPopover
  filterconfig: "app/filter/FilterPopover.svelte",
}

// Combine automatic and manual mappings
const allMappings = { ...exportMappings, ...manualMappings }

// Generate the component mapping object
console.log("// Generated component mappings from manifest.json")
console.log("const componentKeyToFile = {")

componentKeys.forEach(key => {
  const mapping = allMappings[key]
  if (mapping) {
    console.log(`  "${key}": "${mapping}",`)
  } else {
    console.log(`  // TODO: "${key}": "path/to/${key}.svelte",`)
  }
})

console.log("}")

// Show stats
const mappedCount = componentKeys.filter(key => allMappings[key]).length
const totalCount = componentKeys.length

console.log(
  `\n// Stats: ${mappedCount}/${totalCount} components mapped (${Math.round((mappedCount / totalCount) * 100)}%)`
)

if (mappedCount < totalCount) {
  const unmapped = componentKeys.filter(key => !allMappings[key])
  console.log(`// Unmapped components: ${unmapped.join(", ")}`)
}
