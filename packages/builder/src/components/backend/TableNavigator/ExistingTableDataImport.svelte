<script>
  import {
    FieldType,
    BBReferenceFieldSubType,
    SourceName,
  } from "@budibase/types"
  import { Select, Toggle, Multiselect, Label, Layout } from "@budibase/bbui"
  import { DB_TYPE_INTERNAL } from "@/constants/backend"
  import { API } from "@/api"
  import { parseFile } from "./utils"
  import { tables, datasources } from "@/stores/builder"

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
      value: FieldType.STRING,
    },
    {
      label: "Number",
      value: FieldType.NUMBER,
    },
    {
      label: "Date",
      value: FieldType.DATETIME,
    },
    {
      label: "Options",
      value: FieldType.OPTIONS,
    },
    {
      label: "Multi-select",
      value: FieldType.ARRAY.type,
    },
    {
      label: "Barcode/QR",
      value: FieldType.BARCODEQR,
    },
    {
      label: "Long Form Text",
      value: FieldType.LONGFORM,
    },
    {
      label: "Attachment",
      value: FieldType.ATTACHMENT_SINGLE,
    },
    {
      label: "Signature",
      value: FieldType.SIGNATURE_SINGLE,
    },
    {
      label: "Attachment list",
      value: FieldType.ATTACHMENTS,
    },
    {
      label: "Users",
      value: `${FieldType.BB_REFERENCE}${BBReferenceFieldSubType.USER}`,
    },
    {
      label: "Users",
      value: `${FieldType.BB_REFERENCE}${BBReferenceFieldSubType.USERS}`,
    },
    {
      label: "User",
      value: `${FieldType.BB_REFERENCE_SINGLE}${BBReferenceFieldSubType.USER}`,
    },
  ]

  $: {
    schema = fetchSchema(tableId)
  }

  $: table = $tables.list.find(table => table._id === tableId)
  $: datasource = $datasources.list.find(ds => ds._id === table?.sourceId)

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
    const previousValidation = validation
    validation = {}

    try {
      const response = await parseFile(e)
      rows = response.rows
      fileName = response.fileName

      const newValidateHash = JSON.stringify(rows)
      if (newValidateHash === validateHash) {
        validation = previousValidation
      } else {
        await validate(rows)
        validateHash = newValidateHash
      }
    } catch (e) {
      error = e.message || e
    } finally {
      loading = false
    }
  }

  async function validate(rows) {
    error = null
    validation = {}
    allValid = false

    if (rows.length > 0) {
      const response = await API.validateExistingTableImport(rows, tableId)
      validation = response.schemaValidation
      invalidColumns = response.invalidColumns
      allValid = response.allValid
    }
  }
</script>

<Layout gap="S" noPadding>
  <Layout noPadding gap="XS">
    <Label grey extraSmall>CSV or JSON file to import</Label>
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
  </Layout>

  {#if fileName && Object.keys(validation).length === 0}
    <div>No valid fields - please try another file.</div>
  {:else if fileName && rows.length > 0 && !error}
    <div>
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
    <!-- SQL Server doesn't yet support overwriting rows by existing keys -->
    {#if datasource?.source !== SourceName.SQL_SERVER}
      <Toggle
        bind:value={updateExistingRows}
        on:change={() => (identifierFields = [])}
        thin
        text="Update existing rows"
      />
    {/if}
    {#if updateExistingRows}
      {#if tableType === DB_TYPE_INTERNAL}
        <Multiselect
          label="Identifier field(s)"
          options={Object.keys(validation)}
          bind:value={identifierFields}
        />
      {:else}
        <div>Rows will be updated based on the table's primary key.</div>
      {/if}
    {/if}
    {#if invalidColumns.length > 0}
      <Layout noPadding gap="XS">
        <div>
          The following columns are present in the data you wish to import, but
          do not match the schema of this table and will be ignored:
        </div>
        <div>
          {#each invalidColumns as column}
            - {column}<br />
          {/each}
        </div>
      </Layout>
    {/if}
  {/if}
</Layout>

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
    background-color: var(--spectrum-global-color-gray-300);
    font-size: var(--font-size-s);
    line-height: normal;
    border: var(--border-transparent);
  }
  .uploaded {
    color: var(--spectrum-global-color-blue-600);
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
</style>
