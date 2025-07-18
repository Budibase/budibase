<script lang="ts">
  import { goto, url } from "@roxi/routify"
  import { tables, datasources } from "@/stores/builder"
  import {
    notifications,
    Input,
    ModalContent,
    TextArea,
    Layout,
    Label,
    Button,
  } from "@budibase/bbui"
  import TableDataImport from "../TableDataImport.svelte"
  import {
    FILE_SIZE_LIMIT,
    parseCSV,
    parseJSON,
    parseFile,
    validateImport,
    type ImportResult,
  } from "../utils"
  import {
    BUDIBASE_INTERNAL_DB_ID,
    BUDIBASE_DATASOURCE_TYPE,
  } from "@/constants/backend"

  import { canBeDisplayColumn, memo } from "@budibase/frontend-core"
  import { utils } from "@budibase/shared-core"
  import {
    TableSourceType,
    type UIFieldSchema,
    type Row,
    type Table,
  } from "@budibase/types"

  export let promptUpload = false
  export let name: string
  export let beforeSave = async () => {}
  export let afterSave = async (table: Table) => {
    notifications.success(`Table ${name} created successfully.`)

    // Navigate to new table
    const currentUrl = $url()
    const path = currentUrl.endsWith("data")
      ? `./table/${table._id}`
      : `../../table/${table._id}`
    $goto(path)
  }

  let memoRows = memo<Row[]>([])
  let memoSchema = memo<Record<string, UIFieldSchema>>({})

  let fileInput: HTMLInputElement
  let fileName: string | null
  let fileError: string | null
  let loading = false

  let tableNameError = ""
  let errors: Record<string, string> | undefined = undefined
  let isValid = true
  let displayColumn: string | null = null
  let validation: Record<string, boolean> | undefined = undefined

  let processingRawInput = false
  let rawInputError: string | undefined = undefined
  let processed: string | null = null

  $: processedRows = $memoRows.map(row =>
    utils.trimOtherProps(row, Object.keys($memoSchema))
  )

  $: schemaLoaded = !!Object.keys($memoSchema).length

  // Only validate if either of these change
  $: validateContent(processedRows, $memoSchema)

  $: if (displayColumn && !canBeDisplayColumn($memoSchema[displayColumn])) {
    displayColumn = null
  }

  $: tableNames = $tables.list.map(table => table.name)
  $: selectedSource = $datasources.list.find(
    source => source._id === $datasources.selected
  )

  $: isSelectedInternal = selectedSource?.type === BUDIBASE_DATASOURCE_TYPE
  $: targetDatasourceId = isSelectedInternal
    ? selectedSource?._id
    : BUDIBASE_INTERNAL_DB_ID

  $: triage = !!rawInputError && !!processed

  $: openFileUpload(promptUpload, fileInput)

  // Validate the contents
  const validateContent = async (
    rows: Row[],
    schema: Record<string, UIFieldSchema>
  ) => {
    if (!rows.length || !Object.keys(schema).length) return
    const result: ImportResult = await validateImport(rows, schema)
    isValid = result.allValid
    errors = result.errors
    validation = result.validation
  }

  function checkValid(evt: any) {
    const tableName = evt.target?.value
    if (tableNames.includes(tableName)) {
      tableNameError = `Table with name ${tableName} already exists. Please choose another name.`
      return
    }
    tableNameError = ""
  }

  async function saveTable() {
    if (!targetDatasourceId) return
    let newTable: Table & { rows: Row[] } = {
      name,
      schema: { ...$memoSchema },
      rows: [...$memoRows],
      type: "table",
      sourceId: targetDatasourceId,
      sourceType: TableSourceType.INTERNAL,
    }

    // Only set primary display if defined
    if (displayColumn && displayColumn.length) {
      newTable.primaryDisplay = displayColumn
    }

    // Create table
    let table
    try {
      await beforeSave()
      table = await tables.save(newTable)
      await datasources.fetch()
      await afterSave(table)
    } catch (e: any) {
      notifications.error(e.message || e)
      // reload in case the table was created
      await tables.fetch()
    }
  }

  const handleFile = async (e: Event) => {
    loading = true
    fileError = null
    validation = {}

    try {
      const response = await parseFile(e)
      memoRows.set(response.rows)
      memoSchema.set(response.schema)
      fileName = response.fileName
    } catch (e: any) {
      fileError = e.message
    }
    loading = false
  }

  const openFileUpload = (
    promptUpload: boolean,
    fileInput: HTMLInputElement
  ) => {
    if (promptUpload && fileInput) {
      fileInput.click()
    }
  }

  const processRawInput = async (e: CustomEvent) => {
    const content = e.detail.trim()

    // check what was last processed to avoid reprocessing.
    if (!content || content === processed || triage) return

    processingRawInput = true

    // Restrict in the same way as a regular file upload.
    const blob = new Blob([content], { type: "text/plain" })
    if (blob.size > FILE_SIZE_LIMIT) {
      rawInputError = "Text too large"
      return
    }

    // Parse content
    const jsonResult = parseJSON(content)
    const csvResult = !jsonResult.content ? await parseCSV(content) : null

    // Determine which format was successful and handle accordingly
    let result = null

    if (jsonResult.content && !jsonResult.error) {
      // JSON parsed successfully
      result = jsonResult
    } else if (csvResult && !csvResult.error) {
      // CSV parsed successfully
      result = csvResult
    }

    if (result) {
      // Successfully parsed either JSON or CSV
      memoRows.set(result.rows)
      memoSchema.set(result.schema)
    } else {
      if (jsonResult.error && csvResult?.error) {
        rawInputError = csvResult.error
      } else if (jsonResult.error && jsonResult.content) {
        rawInputError = jsonResult.error
      } else {
        rawInputError = "Unable to parse content as JSON or CSV"
      }
    }

    // Done processing
    processingRawInput = false
    processed = content
  }
</script>

<ModalContent
  title="Create Table"
  confirmText="Create"
  onConfirm={saveTable}
  disabled={!!tableNameError ||
    !name ||
    ($memoRows.length > 0 && (!isValid || displayColumn == null))}
  size="M"
>
  <Input
    label="Table Name"
    on:input={checkValid}
    bind:value={name}
    error={tableNameError}
    disabled={processingRawInput}
  />

  {#if !schemaLoaded}
    <div class="raw-text">
      <TextArea
        error={rawInputError}
        label="Paste raw CSV/JSON"
        on:change={processRawInput}
        disabled={!!processingRawInput || Object.keys($memoSchema).length > 0}
        updateOnChange
      />
    </div>
    {#if !rawInputError}
      <Layout gap="XS" noPadding>
        <Label size="S">
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
          <label for="file-upload" class:uploaded={$memoRows.length > 0}>
            {#if fileError}
              Error: {fileError}
            {:else if fileName}
              {fileName}
            {:else}
              Upload
            {/if}
          </label>
        </div>
      </Layout>
    {/if}
  {/if}
  <div slot="footer">
    {#if schemaLoaded || rawInputError}
      <Button
        quiet
        secondary
        on:click={() => {
          memoRows.set([])
          memoSchema.set({})
          displayColumn = null
          processed = null
          rawInputError = undefined
          fileName = null
          fileError = null
        }}
      >
        Reset
      </Button>
    {/if}
  </div>

  <TableDataImport
    rows={processedRows}
    schema={$memoSchema}
    {displayColumn}
    {validation}
    {errors}
    on:update={e => {
      const { schema: schemaUpdate, displayColumn: displayColumnUpdate } =
        e.detail
      if (schemaUpdate) memoSchema.set(schemaUpdate)
      if (displayColumnUpdate) displayColumn = displayColumnUpdate
    }}
  />
</ModalContent>

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
    font-feature-settings:
      "case" 1,
      "rlig" 1,
      "calt" 0;
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
</style>
