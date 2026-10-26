<script lang="ts">
  import { Select, Icon, Layout, Label, Dropzone } from "@budibase/bbui"
  import { FIELDS } from "@/constants/backend"
  import { utils } from "@budibase/shared-core"
  import { canBeDisplayColumn } from "@budibase/frontend-core"
  import { API } from "@/api"
  import { getValidationRows, parseFile } from "./utils"
  import type {
    FieldSchema,
    Row,
    TableSchema,
    UIFieldSchema,
  } from "@budibase/types"

  interface ParsedFile {
    rows: Row[]
    schema: TableSchema
  }

  interface ImportFieldConfig {
    type: FieldSchema["type"]
    subtype?: string
    constraints?: FieldSchema["constraints"]
  }

  interface Props {
    rows?: Row[]
    schema?: TableSchema
    allValid?: boolean
    displayColumn?: string | null
  }

  let {
    rows = $bindable([]),
    schema = $bindable({}),
    allValid = $bindable(true),
    displayColumn = $bindable(null),
  }: Props = $props()

  const typeOptions: Record<
    string,
    { label: string; value: string; config: ImportFieldConfig }
  > = {
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
      label: "Single select",
      value: FIELDS.OPTIONS.type,
      config: {
        type: FIELDS.OPTIONS.type,
        constraints: FIELDS.OPTIONS.constraints,
      },
    },
    [FIELDS.ARRAY.type]: {
      label: "Multi select",
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

  let files: File[] = $state([])
  let error: string | null = $state(null)
  let loading = $state(false)
  let validation: Record<string, boolean> = $state({})
  let validateHash = $state("")
  let errors: Record<string, string> = $state({})
  let selectedColumnTypes: Record<string, string> = $state({})

  let rawRows: Row[] = $state([])
  let rowsHash = $state("")
  let fileSequence = 0
  let validationSequence = 0

  const displayColumnOptions = $derived(
    Object.keys(schema || {}).filter(column => {
      return (
        validation[column] &&
        canBeDisplayColumn(schema[column] as UIFieldSchema)
      )
    })
  )

  $effect(() => {
    const column = displayColumn ? schema[displayColumn] : undefined
    if (
      displayColumn &&
      (!column || !canBeDisplayColumn(column as UIFieldSchema))
    ) {
      displayColumn = null
    }
  })

  $effect(() => {
    const nextRows = rawRows.map(row =>
      utils.trimOtherProps(row, Object.keys(schema))
    )
    const nextRowsHash = JSON.stringify(nextRows)
    if (nextRowsHash !== rowsHash) {
      rows = nextRows
      rowsHash = nextRowsHash
    }

    const validationRows = getValidationRows(nextRows)
    const newValidateHash =
      JSON.stringify(validationRows) + JSON.stringify(schema)
    if (newValidateHash !== validateHash) {
      if (validationRows.length) {
        validate({ rowsToValidate: validationRows, schema })
      } else {
        validation = {}
        errors = {}
      }
    }
    validateHash = newValidateHash
  })

  const resetImport = () => {
    validationSequence++
    displayColumn = null
    rawRows = []
    rows = []
    schema = {}
    selectedColumnTypes = {}
    validation = {}
    errors = {}
    validateHash = ""
    rowsHash = ""
  }

  async function handleFile(e: CustomEvent<File[]>) {
    const sequence = ++fileSequence
    resetImport()
    error = null
    loading = false
    allValid = e.detail.length === 0
    if (e.detail.length === 0) {
      return
    }
    if (e.detail.length !== 1) {
      files = []
      error = "Choose one CSV or JSON file."
      return
    }
    loading = true

    try {
      const response = (await parseFile(e.detail[0])) as ParsedFile
      if (sequence !== fileSequence) {
        return
      }
      rawRows = response.rows
      schema = response.schema
      selectedColumnTypes = Object.entries(response.schema).reduce(
        (acc, [colName, fieldConfig]) => ({
          ...acc,
          [colName]: fieldConfig.type,
        }),
        {}
      )
      if (response.rows.length === 0) {
        allValid = true
        loading = false
      }
    } catch (e) {
      if (sequence !== fileSequence) {
        return
      }
      resetImport()
      files = []
      error = e instanceof Error ? e.message : String(e)
      allValid = false
      loading = false
    }
  }

  async function validate({
    rowsToValidate,
    schema,
  }: {
    rowsToValidate: Row[]
    schema: TableSchema
  }) {
    const sequence = ++validationSequence
    allValid = false
    loading = true
    try {
      const response = await API.validateNewTableImport(rowsToValidate, schema)
      if (sequence !== validationSequence) {
        return
      }
      validation = response.schemaValidation
      allValid = response.allValid
      errors = response.errors
      error = null
    } catch (e) {
      if (sequence !== validationSequence) {
        return
      }
      error = e instanceof Error ? e.message : String(e)
      validation = {}
      allValid = false
      errors = {}
    } finally {
      if (sequence === validationSequence) {
        loading = false
      }
    }
  }

  const handleChange = (name: string, e: CustomEvent<string>) => {
    const option = typeOptions[e.detail]
    if (!option) {
      return
    }
    const field = schema[name]
    if (!field) {
      return
    }
    const { subtype: _subtype, ...fieldWithoutSubtype } = field
    schema[name] = {
      ...fieldWithoutSubtype,
      ...option.config,
    } as FieldSchema
    schema = schema
  }

  const deleteColumn = (name: string) => {
    if (loading) {
      return
    }
    delete schema[name]
    schema = schema
  }
</script>

<Layout noPadding gap="S">
  <Layout gap="XS" noPadding>
    <Label muted size="S">
      Create a Table from a CSV or JSON file (Optional)
    </Label>
    <Dropzone
      bind:value={files}
      disabled={loading}
      error={error || undefined}
      extensions=".csv,.json"
      fileTags={["CSV", "JSON"]}
      maximum={1}
      gallery={false}
      on:change={handleFile}
    />
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
            placeholder={false}
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
                <Icon name="question" tooltip={errors[column.name]} />
              {/if}
            {/if}
          </span>
          <Icon
            size="S"
            name="x"
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
  .fieldStatusFailure :global(i) {
    width: 12px;
  }
</style>
