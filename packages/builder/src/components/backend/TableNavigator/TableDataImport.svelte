<script>
  import { Select, InlineAlert, notifications } from "@budibase/bbui"
  import { FIELDS } from "constants/backend"
  import { API } from "api"

  const BYTES_IN_MB = 1000000
  const FILE_SIZE_LIMIT = BYTES_IN_MB * 5

  export let files = []
  export let dataImport = {
    valid: true,
    schema: {},
  }
  export let existingTableId

  let csvString = undefined
  let primaryDisplay = undefined
  let schema = {}
  let fields = []
  let hasValidated = false

  $: valid =
    !schema ||
    (fields.every(column => schema[column].success) &&
      (!hasValidated || Object.keys(schema).length > 0))
  $: dataImport = {
    valid,
    schema: buildTableSchema(schema),
    csvString,
    primaryDisplay,
  }
  $: noFieldsError = existingTableId
    ? "No columns in CSV match existing table schema"
    : "Could not find any columns to import"

  function buildTableSchema(schema) {
    const tableSchema = {}
    for (let key in schema) {
      const type = schema[key].type

      if (type === "omit") continue

      tableSchema[key] = {
        name: key,
        type,
        constraints: FIELDS[type.toUpperCase()].constraints,
      }
    }
    return tableSchema
  }

  async function validateCSV() {
    try {
      const parseResult = await API.validateTableCSV({
        csvString,
        schema: schema || {},
        tableId: existingTableId,
      })
      schema = parseResult?.schema
      fields = Object.keys(schema || {}).filter(
        key => schema[key].type !== "omit"
      )

      // Check primary display is valid
      if (!primaryDisplay || fields.indexOf(primaryDisplay) === -1) {
        primaryDisplay = fields[0]
      }

      hasValidated = true
    } catch (error) {
      notifications.error("CSV Invalid, please try another CSV file")
    }
  }

  async function handleFile(evt) {
    const fileArray = Array.from(evt.target.files)
    if (fileArray.some(file => file.size >= FILE_SIZE_LIMIT)) {
      notifications.error(
        `Files cannot exceed ${
          FILE_SIZE_LIMIT / BYTES_IN_MB
        }MB. Please try again with smaller files.`
      )
      return
    }

    // Read CSV as plain text to upload alongside schema
    let reader = new FileReader()
    reader.addEventListener("load", function (e) {
      csvString = e.target.result
      files = fileArray
      validateCSV()
    })
    reader.readAsText(fileArray[0])
  }

  async function omitColumn(columnName) {
    schema[columnName].type = "omit"
    await validateCSV()
  }

  const handleTypeChange = column => evt => {
    schema[column].type = evt.detail
    validateCSV()
  }

  const typeOptions = [
    {
      label: "Text",
      value: FIELDS.STRING.type,
    },
    {
      label: "Number",
      value: FIELDS.NUMBER.type,
    },
    {
      label: "Date",
      value: FIELDS.DATETIME.type,
    },
    {
      label: "Options",
      value: FIELDS.OPTIONS.type,
    },
    {
      label: "Multi-select",
      value: FIELDS.ARRAY.type,
    },
    {
      label: "Barcode/QR",
      value: FIELDS.BARCODEQR.type,
    },
    {
      label: "Long Form Text",
      value: FIELDS.LONGFORM.type,
    },
  ]
</script>

<div class="dropzone">
  <input id="file-upload" accept=".csv" type="file" on:change={handleFile} />
  <label for="file-upload" class:uploaded={files[0]}>
    {#if files[0]}{files[0].name}{:else}Upload{/if}
  </label>
</div>
{#if fields.length}
  <div class="schema-fields">
    {#each fields as columnName}
      <div class="field">
        <span>{columnName}</span>
        <Select
          bind:value={schema[columnName].type}
          on:change={handleTypeChange(columnName)}
          options={typeOptions}
          placeholder={null}
          getOptionLabel={option => option.label}
          getOptionValue={option => option.value}
          disabled={!!existingTableId}
        />
        <span class="field-status" class:error={!schema[columnName].success}>
          {schema[columnName].success ? "Success" : "Failure"}
        </span>
        <i
          class="omit-button ri-close-circle-fill"
          on:click={() => omitColumn(columnName)}
        />
      </div>
    {/each}
  </div>
  {#if !existingTableId}
    <div class="display-column">
      <Select
        label="Display Column"
        bind:value={primaryDisplay}
        options={fields}
        sort
      />
    </div>
  {/if}
{:else if hasValidated}
  <div>
    <InlineAlert
      header="Invalid CSV"
      bind:message={noFieldsError}
      type="error"
    />
  </div>
{/if}

<style>
  .dropzone {
    text-align: center;
    display: flex;
    align-items: center;
    flex-direction: column;
    border-radius: 10px;
    transition: all 0.3s;
  }

  .field-status {
    color: var(--green);
    justify-self: center;
    font-weight: 600;
  }

  .error {
    color: var(--red);
  }

  .uploaded {
    color: var(--blue);
  }

  input[type="file"] {
    display: none;
  }

  .schema-fields {
    margin-top: var(--spacing-xl);
  }

  label {
    font-family: var(--font-sans);
    cursor: pointer;
    font-weight: 600;
    box-sizing: border-box;
    overflow: hidden;
    border-radius: var(--border-radius-s);
    color: var(--ink);
    padding: var(--spacing-m) var(--spacing-l);
    transition: all 0.2s ease 0s;
    display: inline-flex;
    text-rendering: optimizeLegibility;
    min-width: auto;
    outline: none;
    font-feature-settings: "case" 1, "rlig" 1, "calt" 0;
    -webkit-box-align: center;
    user-select: none;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    width: 100%;
    background-color: var(--grey-2);
    font-size: var(--font-size-xs);
    line-height: normal;
    border: var(--border-transparent);
  }

  .omit-button {
    font-size: 1.2em;
    color: var(--grey-7);
    cursor: pointer;
    justify-self: flex-end;
  }

  .field {
    display: grid;
    grid-template-columns: 2fr 2fr 1fr auto;
    margin-top: var(--spacing-m);
    align-items: center;
    grid-gap: var(--spacing-m);
    font-size: var(--spectrum-global-dimension-font-size-75);
  }

  .display-column {
    margin-top: var(--spacing-xl);
  }
</style>
