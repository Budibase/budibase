<script>
  import { Select, Icon, Layout, Label } from "@budibase/bbui"
  import { FIELDS } from "@/constants/backend"
  import { utils } from "@budibase/shared-core"
  import { canBeDisplayColumn } from "@budibase/frontend-core"
  import { API } from "@/api"
  import { parseFile } from "./utils"

  export let rows = []
  export let schema = {}
  export let allValid = true
  export let displayColumn = null
  export let promptUpload = false

  const typeOptions = {
    [FIELDS.STRING.type]: {
      label: "Text",
      value: FIELDS.STRING.type,
      config: {
        type: FIELDS.STRING.type,
        constraints: FIELDS.STRING.constraints,
      },
    },
    [FIELDS.NUMBER.type]: {
      label: "Number",
      value: FIELDS.NUMBER.type,
      config: {
        type: FIELDS.NUMBER.type,
        constraints: FIELDS.NUMBER.constraints,
      },
    },
    [FIELDS.DATETIME.type]: {
      label: "Date",
      value: FIELDS.DATETIME.type,
      config: {
        type: FIELDS.DATETIME.type,
        constraints: FIELDS.DATETIME.constraints,
      },
    },
    [FIELDS.OPTIONS.type]: {
      label: "Options",
      value: FIELDS.OPTIONS.type,
      config: {
        type: FIELDS.OPTIONS.type,
        constraints: FIELDS.OPTIONS.constraints,
      },
    },
    [FIELDS.ARRAY.type]: {
      label: "Multi-select",
      value: FIELDS.ARRAY.type,
      config: {
        type: FIELDS.ARRAY.type,
        constraints: FIELDS.ARRAY.constraints,
      },
    },
    [FIELDS.BARCODEQR.type]: {
      label: "Barcode/QR",
      value: FIELDS.BARCODEQR.type,
      config: {
        type: FIELDS.BARCODEQR.type,
        constraints: FIELDS.BARCODEQR.constraints,
      },
    },
    [FIELDS.LONGFORM.type]: {
      label: "Long Form Text",
      value: FIELDS.LONGFORM.type,
      config: {
        type: FIELDS.LONGFORM.type,
        constraints: FIELDS.LONGFORM.constraints,
      },
    },
    user: {
      label: "User",
      value: "user",
      config: {
        type: FIELDS.USER.type,
        subtype: FIELDS.USER.subtype,
        constraints: FIELDS.USER.constraints,
      },
    },
    users: {
      label: "Users",
      value: "users",
      config: {
        type: FIELDS.USERS.type,
        subtype: FIELDS.USERS.subtype,
        constraints: FIELDS.USERS.constraints,
      },
    },
  }

  let fileInput
  let error = null
  let fileName = null
  let loading = false
  let validation = {}
  let validateHash = ""
  let errors = {}
  let selectedColumnTypes = {}

  let rawRows = []

  $: displayColumnOptions = Object.keys(schema || {}).filter(column => {
    return validation[column] && canBeDisplayColumn(schema[column])
  })

  $: if (displayColumn && !canBeDisplayColumn(schema[displayColumn])) {
    displayColumn = null
  }

  $: {
    rows = rawRows.map(row => utils.trimOtherProps(row, Object.keys(schema)))

    // binding in consumer is causing double renders here
    const newValidateHash = JSON.stringify(rows) + JSON.stringify(schema)
    if (newValidateHash !== validateHash) {
      validate(rows, schema)
    }
    validateHash = newValidateHash
  }
  $: openFileUpload(promptUpload, fileInput)

  async function handleFile(e) {
    loading = true
    error = null
    validation = {}

    try {
      const response = await parseFile(e)
      rawRows = response.rows
      schema = response.schema
      fileName = response.fileName
      selectedColumnTypes = Object.entries(response.schema).reduce(
        (acc, [colName, fieldConfig]) => ({
          ...acc,
          [colName]: fieldConfig.type,
        }),
        {}
      )
    } catch (e) {
      loading = false
      error = e
    }
  }

  async function validate(rows, schema) {
    loading = true
    try {
      if (rows.length > 0) {
        const response = await API.validateNewTableImport(rows, schema)
        validation = response.schemaValidation
        allValid = response.allValid
        errors = response.errors
        error = null
      }
    } catch (e) {
      error = e.message
      validation = {}
      allValid = false
      errors = {}
    }
    loading = false
  }

  const handleChange = (name, e) => {
    const { config } = typeOptions[e.detail]
    schema[name].type = config.type
    schema[name].subtype = config.subtype
    schema[name].constraints = config.constraints
  }

  const openFileUpload = (promptUpload, fileInput) => {
    if (promptUpload && fileInput) {
      fileInput.click()
    }
  }

  const deleteColumn = name => {
    if (loading) {
      return
    }
    delete schema[name]
    schema = schema
  }
</script>

<Layout noPadding gap="S">
  <Layout gap="XS" noPadding>
    <Label grey extraSmall>
      Create a Table from a CSV or JSON file (Optional)
    </Label>
    <div class="dropzone">
      <input
        bind:this={fileInput}
        disabled={loading}
        id="file-upload"
        accept="text/csv,application/json"
        type="file"
        on:change={handleFile}
      />
      <label for="file-upload" class:uploaded={rawRows.length > 0}>
        {#if error}
          Error: {error}
        {:else if fileName}
          {fileName}
        {:else}
          Upload
        {/if}
      </label>
    </div>
  </Layout>

  {#if rawRows.length > 0 && !error}
    <div>
      {#each Object.entries(schema) as [name, column]}
        <div class="field">
          <span>{column.name}</span>
          <Select
            bind:value={selectedColumnTypes[column.name]}
            on:change={e => handleChange(name, e)}
            options={Object.values(typeOptions)}
            placeholder={null}
            getOptionLabel={option => option.label}
            getOptionValue={option => option.value}
          />
          <span
            class={validation[column.name]
              ? "fieldStatusSuccess"
              : "fieldStatusFailure"}
          >
            {#if validation[column.name]}
              Success
            {:else}
              Failure
              {#if errors[column.name]}
                <Icon name="Help" tooltip={errors[column.name]} />
              {/if}
            {/if}
          </span>
          <Icon
            size="S"
            name="Close"
            hoverable
            on:click={() => deleteColumn(column.name)}
          />
        </div>
      {/each}
    </div>
    <Select
      label="Display Column"
      bind:value={displayColumn}
      options={displayColumnOptions}
      sort
    />
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
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .fieldStatusFailure :global(.spectrum-Icon) {
    width: 12px;
  }
</style>
