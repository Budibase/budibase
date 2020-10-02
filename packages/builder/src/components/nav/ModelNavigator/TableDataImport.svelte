<script>
  import { Heading, Body, Button, Select } from "@budibase/bbui"
  import { notifier } from "builderStore/store/notifications"
  import { FIELDS } from "constants/backend"

  const BYTES_IN_KB = 1000
  const BYTES_IN_MB = 1000000
  const FILE_SIZE_LIMIT = BYTES_IN_MB * 1

  export let files = []
  export let dataImport = {
    valid: true,
    schema: {},
  }

  let parseResult

  $: schema = parseResult && parseResult.schema
  $: valid =
    schema && Object.keys(schema).every(column => schema[column].success)
  $: dataImport = {
    valid,
    schema: buildModelSchema(schema),
    path: files.length && files[0].path,
  }

  function buildModelSchema(schema) {
    const modelSchema = {}
    for (let key in schema) {
      const type = schema[key].type
      modelSchema[key] = {
        name: key,
        type,
        constraints: FIELDS[type.toUpperCase()].constraints,
      }
    }
    return modelSchema
  }

  async function validateCSV() {
    const response = await fetch("/api/models/csv/validate", {
      method: "POST",
      body: JSON.stringify({
        file: files[0],
        schema: schema || {},
      }),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })

    parseResult = await response.json()

    if (response.status !== 200) {
      notifier.danger("CSV Invalid, please try another CSV file")
      return []
    }
  }

  async function handleFile(evt) {
    const fileArray = Array.from(evt.target.files)
    const filesToProcess = fileArray.map(({ name, path, size }) => ({
      name,
      path,
      size,
    }))

    if (filesToProcess.some(file => file.size >= FILE_SIZE_LIMIT)) {
      notifier.danger(
        `Files cannot exceed ${FILE_SIZE_LIMIT /
          BYTES_IN_MB}MB. Please try again with smaller files.`
      )
      return
    }

    files = filesToProcess

    await validateCSV()
  }

  function omitColumn(columnName) {
    parsers[columnName] = PARSERS.omit
  }

  const handleTypeChange = column => evt => {
    schema[column].type = evt.target.value
    validateCSV()
  }
</script>

<div class="dropzone">
  <input id="file-upload" accept=".csv" type="file" on:change={handleFile} />
  <label for="file-upload">
    {#if files[0]}{files[0].name}{:else}Upload{/if}
  </label>
</div>
<div class="schema-fields">
  {#if schema}
    {#each Object.keys(schema) as columnName}
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
        <span
          class:success={schema[columnName].success}
          class:error={!schema[columnName].success}>
          {schema[columnName].success ? 'Success' : 'Failure'}
        </span>
        <i
          class="omit-button ri-close-circle-fill"
          on:click={() => omitColumn(columnName)} />
      </div>
    {/each}
  {/if}
</div>

<style>
  .dropzone {
    text-align: center;
    display: flex;
    align-items: center;
    flex-direction: column;
    border-radius: 10px;
    transition: all 0.3s;
  }

  .success {
    color: green;
  }

  .error {
    color: red;
  }

  input[type="file"] {
    display: none;
  }

  label {
    font-family: var(--font-sans);
    cursor: pointer;
    font-weight: 600;
    box-sizing: border-box;
    overflow: hidden;
    border-radius: var(--border-radius-s);
    color: var(--white);
    padding: var(--spacing-s) var(--spacing-l);
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
    margin-top: 10px;
    width: 100%;
    border: solid 1.5px var(--ink);
    background-color: var(--ink);
  }

  /* .schema-fields {
  } */

  .omit-button {
    font-size: 1.2em;
    color: var(--grey-7);
    cursor: pointer;
  }

  .field {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    margin-top: var(--spacing-m);
    align-items: center;
    grid-gap: var(--spacing-m);
  }
</style>
