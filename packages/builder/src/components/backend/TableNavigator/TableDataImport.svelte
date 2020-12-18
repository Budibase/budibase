<script>
  import { Select, Label } from "@budibase/bbui"
  import { notifier } from "builderStore/store/notifications"
  import { FIELDS } from "constants/backend"
  import api from "builderStore/api"

  const BYTES_IN_MB = 1000000
  const FILE_SIZE_LIMIT = BYTES_IN_MB * 1

  export let files = []
  export let dataImport = {
    valid: true,
    schema: {},
  }

  let csvString
  let primaryDisplay
  let schema = {}
  let fields = []

  $: console.log(files[0])
  $: valid = !schema || fields.every(column => schema[column].success)
  $: dataImport = {
    valid,
    schema: buildTableSchema(schema),
    csvString,
    primaryDisplay,
  }

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
    console.log(csvString)
    const response = await api.post("/api/tables/csv/validate", {
      csvString,
      schema: schema || {},
    })

    const parseResult = await response.json()
    schema = parseResult && parseResult.schema
    fields = Object.keys(schema || {}).filter(
      key => schema[key].type !== "omit"
    )

    // Check primary display is valid
    if (!primaryDisplay || fields.indexOf(primaryDisplay) === -1) {
      primaryDisplay = fields[0]
    }

    if (response.status !== 200) {
      notifier.danger("CSV Invalid, please try another CSV file")
      return []
    }
  }

  async function handleFile(evt) {
    const fileArray = Array.from(evt.target.files)
    if (fileArray.some(file => file.size >= FILE_SIZE_LIMIT)) {
      notifier.danger(
        `Files cannot exceed ${FILE_SIZE_LIMIT /
          BYTES_IN_MB}MB. Please try again with smaller files.`
      )
      return
    }

    // Read CSV as plain text to upload alongside schema
    let reader = new FileReader()
    reader.addEventListener("load", function(e) {
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
    schema[column].type = evt.target.value
    validateCSV()
  }
</script>

<div class="dropzone">
  <input id="file-upload" accept=".csv" type="file" on:change={handleFile} />
  <label for="file-upload" class:uploaded={files[0]}>
    {#if files[0]}{files[0].name}{:else}Upload{/if}
  </label>
</div>
<div class="schema-fields">
  {#if fields.length}
    {#each fields as columnName}
      <div class="field">
        <span>{columnName}</span>
        <Select
          secondary
          thin
          bind:value={schema[columnName].type}
          on:change={handleTypeChange(columnName)}>
          <option value={'string'}>Text</option>
          <option value={'number'}>Number</option>
          <option value={'datetime'}>Date</option>
        </Select>
        <span class="field-status" class:error={!schema[columnName].success}>
          {schema[columnName].success ? 'Success' : 'Failure'}
        </span>
        <i
          class="omit-button ri-close-circle-fill"
          on:click={() => omitColumn(columnName)} />
      </div>
    {/each}
  {/if}
</div>
{#if fields.length}
  <div class="display-column">
    <Label extraSmall grey>Display Column</Label>
    <Select thin secondary bind:value={primaryDisplay}>
      {#each fields as field}
        <option value={field}>{field}</option>
      {/each}
    </Select>
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
    font-weight: 500;
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

  label {
    font-family: var(--font-sans);
    cursor: pointer;
    font-weight: 500;
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
    grid-template-columns: repeat(4, 1fr);
    margin-top: var(--spacing-m);
    align-items: center;
    grid-gap: var(--spacing-m);
    font-size: var(--font-size-xs);
  }

  .display-column {
    margin-top: var(--spacing-xl);
  }
</style>
