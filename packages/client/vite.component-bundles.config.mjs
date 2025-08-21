import { svelte } from "@sveltejs/vite-plugin-svelte"
import { defineConfig } from "vite"
import path from "path"
import fs from "fs"
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js"
import { visualizer } from "rollup-plugin-visualizer"

const ignoredWarnings = [
  "unused-export-let",
  "css-unused-selector",
  "module-script-reactive-declaration",
  "a11y-no-onchange",
  "a11y-click-events-have-key-events",
]

// Read manifest.json to get component keys
const manifest = JSON.parse(fs.readFileSync("manifest.json", "utf8"))

// Extract component keys (excluding features and typeSupportPresets)
const componentKeys = Object.keys(manifest).filter(
  key => !["features", "typeSupportPresets"].includes(key)
)

// Generated component mappings from manifest.json
const componentKeyToFile = {
  layout: "app/Layout.svelte",
  container: "app/container/Container.svelte",
  section: "app/deprecated/Section.svelte",
  screenslot: "app/ScreenSlot.svelte",
  buttongroup: "app/ButtonGroup.svelte",
  button: "app/Button.svelte",
  divider: "app/Divider.svelte",
  repeater: "app/Repeater.svelte",
  stackedlist: "app/deprecated/StackedList.svelte",
  card: "app/deprecated/Card.svelte",
  text: "app/deprecated/Text.svelte",
  heading: "app/deprecated/Heading.svelte",
  tag: "app/Tag.svelte",
  image: "app/Image.svelte",
  backgroundimage: "app/BackgroundImage.svelte",
  icon: "app/Icon.svelte",
  navigation: "app/deprecated/Navigation.svelte",
  link: "app/Link.svelte",
  cardhorizontal: "app/deprecated/CardHorizontal.svelte",
  cardstat: "app/CardStat.svelte",
  embed: "app/Embed.svelte",
  bar: "app/charts/BarChart.svelte",
  line: "app/charts/LineChart.svelte",
  area: "app/charts/AreaChart.svelte",
  pie: "app/charts/PieChart.svelte",
  donut: "app/charts/DonutChart.svelte",
  candlestick: "app/charts/CandleStickChart.svelte",
  histogram: "app/charts/HistogramChart.svelte",
  form: "app/forms/Form.svelte",
  formstep: "app/forms/FormStep.svelte",
  fieldgroup: "app/forms/FieldGroup.svelte",
  labelfield: "app/forms/Field.svelte",
  stringfield: "app/forms/StringField.svelte",
  numberfield: "app/forms/NumberField.svelte",
  bigintfield: "app/forms/BigIntField.svelte",
  passwordfield: "app/forms/PasswordField.svelte",
  optionsfield: "app/forms/OptionsField.svelte",
  multifieldselect: "app/forms/MultiFieldSelect.svelte",
  booleanfield: "app/forms/BooleanField.svelte",
  longformfield: "app/forms/LongFormField.svelte",
  datetimefield: "app/forms/DateTimeField.svelte",
  codescanner: "app/forms/CodeScanner.svelte",
  codegenerator: "app/CodeGenerator.svelte",
  signaturesinglefield: "app/forms/SignatureField.svelte",
  embeddedmap: "app/embedded-map/EmbeddedMap.svelte",
  attachmentfield: "app/forms/AttachmentField.svelte",
  attachmentsinglefield: "app/forms/AttachmentSingleField.svelte",
  relationshipfield: "app/forms/RelationshipField.svelte",
  jsonfield: "app/forms/JSONField.svelte",
  s3upload: "app/forms/S3Upload.svelte",
  dataprovider: "app/DataProvider.svelte",
  table: "app/deprecated/table/Table.svelte",
  daterangepicker: "app/DateRangePicker.svelte",
  spectrumcard: "app/SpectrumCard.svelte",
  filter: "app/filter/Filter.svelte",
  filterconfig: "app/filter/FilterPopover.svelte",
  dynamicfilter: "app/dynamic-filter/DynamicFilter.svelte",
  chartblock: "app/blocks/ChartBlock.svelte",
  tableblock: "app/deprecated/TableBlock.svelte",
  cardsblock: "app/blocks/CardsBlock.svelte",
  repeaterblock: "app/blocks/RepeaterBlock.svelte",
  markdownviewer: "app/deprecated/MarkdownViewer.svelte",
  multistepformblock: "app/blocks/MultiStepFormblock.svelte",
  // "multistepformblockstep": virtual component - no separate file
  formblock: "app/blocks/form/FormBlock.svelte",
  sidepanel: "app/SidePanel.svelte",
  modal: "app/Modal.svelte",
  accordion: "app/Accordion.svelte",
  rowexplorer: "app/blocks/RowExplorer.svelte",
  gridblock: "app/GridBlock.svelte",
  bbreferencefield: "app/forms/BBReferenceField.svelte",
  bbreferencesinglefield: "app/forms/BBReferenceSingleField.svelte",
  textv2: "app/Text.svelte",
  pdf: "app/pdf/PDF.svelte",
  pdftable: "app/pdf/PDFTable.svelte",
  singlerowprovider: "app/SingleRowProvider.svelte",
  ratingfield: "app/forms/RatingField.svelte",
}

// Create entry points only for components defined in manifest
const componentEntries = {}
componentKeys.forEach(key => {
  const componentFile = componentKeyToFile[key]
  if (componentFile) {
    const filePath = `src/components/${componentFile}`
    if (fs.existsSync(filePath)) {
      componentEntries[key] = path.resolve(filePath)
    } else {
      console.warn(
        `Warning: Component file not found for "${key}": ${filePath}`
      )
    }
  } else {
    console.warn(`Warning: No file mapping found for component "${key}"`)
  }
})

console.log(
  `Building ${Object.keys(componentEntries).length} manifest-defined components`
)

export default defineConfig(({ mode }) => {
  const isProduction = mode === "production"

  return {
    server: {
      open: false,
    },
    build: {
      rollupOptions: {
        input: componentEntries,
        external: ['svelte', 'svelte/store', 'svelte/internal'],
        output: {
          format: "es",
          dir: "dist/components",
          entryFileNames: "[name].js",
          chunkFileNames: "shared/[name]-[hash].js",
        },
      },
      outDir: "dist/components",
      minify: isProduction,
      lib: {
        entry: componentEntries,
        formats: ["es"],
      },
    },
    plugins: [
      svelte({
        emitCss: true,
        onwarn: (warning, handler) => {
          if (!ignoredWarnings.includes(warning.code)) {
            handler(warning)
          }
        },
      }),
      cssInjectedByJsPlugin(),
      visualizer({
        filename: "dist/components-bundle-analysis.html",
        open: false,
        gzipSize: true,
        brotliSize: true,
      }),
    ],
    resolve: {
      dedupe: ["svelte", "svelte/internal"],
      alias: [
        {
          find: "manifest.json",
          replacement: path.resolve("./manifest.json"),
        },
        {
          find: "@budibase/types",
          replacement: path.resolve("../types/src"),
        },
        {
          find: "@budibase/shared-core",
          replacement: path.resolve("../shared-core/src"),
        },
        {
          find: "@budibase/bbui",
          replacement: path.resolve("../bbui/src"),
        },
        {
          find: "@",
          replacement: path.resolve(__dirname, "src"),
        },
      ],
    },
  }
})
