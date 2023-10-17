<script>
  import { Select, Toggle, Multiselect } from "@budibase/bbui"
  import { FIELDS } from "constants/backend"
  import { API } from "api"
  import { parseFile } from "./utils"

  let error = null
  let fileName = null

  let loading = false
  let updateExistingRows = false
  let validation = {}
  let validateHash = ""
  let schema = null
  let invalidColumns = []

  export let tableId = null
  export let tableType
  export let rows = []
  export let allValid = false
  export let identifierFields = []

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

    {
      label: "User",
      value: `${FIELDS.USER.type}${FIELDS.USER.subtype}`,
    },
    {
      label: "Users",
      value: `${FIELDS.USERS.type}${FIELDS.USERS.subtype}`,
    },
  ]

  $: {
    schema = fetchSchema(tableId)
  }

  async function fetchSchema(tableId) {
    try {
      const definition = await API.fetchTableDefinition(tableId)
      schema = definition.schema
    } catch (e) {
      error = e
    }
  }

  async function handleFile(e) {
    loading = true
    error = null
    validation = {}

    try {
      const response = await parseFile(e)
      rows = response.rows
      fileName = response.fileName
    } catch (e) {
      loading = false
      error = e
    }
  }

  async function validate(rows) {
    loading = true
    error = null
    validation = {}
    allValid = false

    try {
      if (rows.length > 0) {
        const response = await API.validateExistingTableImport({
          rows,
          tableId,
        })

        validation = response.schemaValidation
        invalidColumns = response.invalidColumns
        allValid = response.allValid
      }
    } catch (e) {
      error = e.message
    }

    loading = false
  }

  $: {
    // binding in consumer is causing double renders here
    const newValidateHash = JSON.stringify(rows)

    if (newValidateHash !== validateHash) {
      validate(rows)
    }

    validateHash = newValidateHash
  }
</script>

<div class="dropzone">
  <input
    disabled={!schema || loading}
    id="file-upload"
    accept="text/csv,application/json"
    type="file"
    on:change={handleFile}
  />
  <label for="file-upload" class:uploaded={rows.length > 0}>
    {#if loading}
      loading...
    {:else if error}
      error: {error}
    {:else if fileName}
      {fileName}
    {:else}
      Upload
    {/if}
  </label>
</div>
{#if fileName && Object.keys(validation).length === 0}
  <p>No valid fields, try another file</p>
{:else if rows.length > 0 && !error}
  <div class="schema-fields">
    {#each Object.keys(validation) as name}
      <div class="field">
        <span>{name}</span>
        <Select
          value={`${schema[name]?.type}${schema[name]?.subtype || ""}`}
          options={typeOptions}
          placeholder={null}
          getOptionLabel={option => option.label}
          getOptionValue={option => option.value}
          disabled
        />
        <span
          class={loading || validation[name]
            ? "fieldStatusSuccess"
            : "fieldStatusFailure"}
        >
          {validation[name] ? "Success" : "Failure"}
        </span>
      </div>
    {/each}
  </div>
  {#if tableType === "internal"}
    <br />
    <Toggle
      bind:value={updateExistingRows}
      on:change={() => (identifierFields = [])}
      thin
      text="Update existing rows"
    />
    {#if updateExistingRows}
      <Multiselect
        label="Identifier field(s)"
        options={Object.keys(validation)}
        bind:value={identifierFields}
      />
    {/if}
  {/if}
  {#if invalidColumns.length > 0}
    <p class="spectrum-FieldLabel spectrum-FieldLabel--sizeM">
      The following columns are present in the data you wish to import, but do
      not match the schema of this table and will be ignored.
    </p>
    <ul class="ignoredList">
      {#each invalidColumns as column}
        <li>{column}</li>
      {/each}
    </ul>
  {/if}
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

  input {
    display: none;
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

  .uploaded {
    color: var(--blue);
  }

  .schema-fields {
    margin-top: var(--spacing-xl);
  }

  .field {
    display: grid;
    grid-template-columns: 2fr 2fr 1fr auto;
    margin-top: var(--spacing-m);
    align-items: center;
    grid-gap: var(--spacing-m);
    font-size: var(--spectrum-global-dimension-font-size-75);
  }

  .fieldStatusSuccess {
    color: var(--green);
    justify-self: center;
    font-weight: 600;
  }

  .fieldStatusFailure {
    color: var(--red);
    justify-self: center;
    font-weight: 600;
  }

  .ignoredList {
    margin: 0;
    padding: 0;
    list-style: none;
    font-size: var(--spectrum-global-dimension-font-size-75);
  }
</style>
