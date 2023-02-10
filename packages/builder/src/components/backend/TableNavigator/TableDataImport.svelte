<script>
  import { Select } from "@budibase/bbui"
  import { FIELDS } from "constants/backend"
  import { API } from "api"
  import { parseFile } from "./utils"

  let error = null
  let fileName = null
  let fileType = null

  let loading = false
  let validation = {}
  let validateHash = ""

  export let rows = []
  export let schema = {}
  export let allValid = true
  export let displayColumn = null

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

  async function handleFile(e) {
    loading = true
    error = null
    validation = {}

    try {
      const response = await parseFile(e)
      rows = response.rows
      schema = response.schema
      fileName = response.fileName
      fileType = response.fileType
    } catch (e) {
      loading = false
      error = e
    }
  }

  async function validate(rows, schema) {
    loading = true
    error = null
    validation = {}
    allValid = false

    try {
      if (rows.length > 0) {
        const response = await API.validateNewTableImport({ rows, schema })
        validation = response.schemaValidation
        allValid = response.allValid
      }
    } catch (e) {
      error = e.message
    }

    loading = false
  }

  $: {
    // binding in consumer is causing double renders here
    const newValidateHash = JSON.stringify(rows) + JSON.stringify(schema)

    if (newValidateHash !== validateHash) {
      validate(rows, schema)
    }

    validateHash = newValidateHash
  }

  const handleChange = (name, e) => {
    schema[name].type = e.detail
    schema[name].constraints = FIELDS[e.detail.toUpperCase()].constraints
  }
</script>

<div class="dropzone">
  <input
    disabled={loading}
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
{#if rows.length > 0 && !error}
  <div class="schema-fields">
    {#each Object.entries(schema) as [name, column]}
      <div class="field">
        <span>{column.name}</span>
        <Select
          bind:value={column.type}
          on:change={e => handleChange(name, e)}
          options={typeOptions}
          placeholder={null}
          getOptionLabel={option => option.label}
          getOptionValue={option => option.value}
          disabled={loading}
        />
        <span
          class={loading || validation[column.name]
            ? "fieldStatusSuccess"
            : "fieldStatusFailure"}
        >
          {validation[column.name] ? "Success" : "Failure"}
        </span>
        <i
          class={`omit-button ri-close-circle-fill ${
            loading ? "omit-button-disabled" : ""
          }`}
          on:click={() => {
            delete schema[column.name]
            schema = schema
          }}
        />
      </div>
    {/each}
  </div>
  <div class="display-column">
    <Select
      label="Display Column"
      bind:value={displayColumn}
      options={Object.keys(schema)}
      sort
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

  input {
    display: none;
  }

  label {
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

  .omit-button {
    font-size: 1.2em;
    color: var(--grey-7);
    cursor: pointer;
    justify-self: flex-end;
  }

  .omit-button-disabled {
    pointer-events: none;
    opacity: 70%;
  }

  .display-column {
    margin-top: var(--spacing-xl);
  }
</style>
