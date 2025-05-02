<script lang="ts">
  import { enrichSchemaWithRelColumns, search } from "@budibase/frontend-core"
  import { Toggle } from "@budibase/bbui"
  import {
    getSchemaForDatasource,
    extractLiteralHandlebarsID,
    getDatasourceForProvider,
  } from "@/dataBinding"
  import { selectedScreen } from "@/stores/builder"
  import DraggableList from "../DraggableList/DraggableList.svelte"
  import { createEventDispatcher } from "svelte"
  import FilterSetting from "./FilterSetting.svelte"
  import { removeInvalidAddMissing } from "../GridColumnConfiguration/getColumns.js"
  import {
    FieldType,
    type UIFieldSchema,
    type Component,
    type FilterConfig,
    type Screen,
    type TableSchema,
    type Table,
  } from "@budibase/types"
  import InfoDisplay from "@/pages/builder/app/[application]/design/[screenId]/[componentId]/_components/Component/InfoDisplay.svelte"
  import { findComponent } from "@/helpers/components"
  import { tables } from "@/stores/builder"

  export let value
  export let componentInstance
  export let bindings

  const dispatch = createEventDispatcher()

  let selectedAll = false

  // Load the component for processing
  $: targetId = extractLiteralHandlebarsID(componentInstance.targetComponent)
  $: targetComponent =
    $selectedScreen && targetId
      ? findComponent($selectedScreen?.props, targetId)
      : null

  $: contextDS = getDatasourceForProvider($selectedScreen, targetComponent)

  $: schema = $selectedScreen
    ? getSchema($selectedScreen, contextDS)
    : undefined

  $: searchable = getSearchableFields(schema, $tables.list)

  $: defaultValues = searchable
    .filter((column: UIFieldSchema) => !column.nestedJSON)
    .map(
      (column: UIFieldSchema): FilterConfig => ({
        field: column.name,
        active: !!value == false ? false : !!column.visible,
        columnType: column.type,
      })
    )

  $: parsedColumns = schema
    ? removeInvalidAddMissing(value || [], [...defaultValues]).map(column => ({
        ...column,
      }))
    : []

  const itemUpdate = (e: CustomEvent) => {
    // The item is a component instance. '_instanceName' === 'field'
    const item: Component = e.detail
    const { label } = item

    const updated = parsedColumns.map(entry => {
      if (item._instanceName === entry.field) {
        return { ...entry, label }
      }
      return entry
    })
    dispatch("change", updated)
  }

  const listUpdate = (list: FilterConfig[]) => {
    dispatch("change", list)
  }

  const getSearchableFields = (
    schema: TableSchema | undefined,
    tableList: Table[]
  ) => {
    // Omit calculated fields
    const filtered = Object.values(schema || {}).filter(
      field => !("calculationType" in field)
    )
    return search.getFields(tableList, filtered, {
      allowLinks: true,
    })
  }

  const getSchema = (screen: Screen, datasource: any) => {
    const schema = getSchemaForDatasource(screen, datasource, null)
      .schema as Record<string, UIFieldSchema>

    if (!schema) {
      return
    }

    // Don't show ID and rev in tables
    delete schema._id
    delete schema._rev

    const excludedTypes = [
      FieldType.ATTACHMENT_SINGLE,
      FieldType.ATTACHMENTS,
      FieldType.AI,
      FieldType.SIGNATURE_SINGLE,
    ]

    const filteredSchema = Object.entries(schema || {}).filter(
      ([_, field]: [string, UIFieldSchema]) => {
        return !excludedTypes.includes(field.type)
      }
    )

    const result = enrichSchemaWithRelColumns(
      Object.fromEntries(filteredSchema)
    )
    return result
  }
</script>

<div class="filter-configuration">
  <div class="toggle-all">
    <span>Fields</span>
    <Toggle
      on:change={() => {
        selectedAll = !selectedAll
        let update = parsedColumns.map(field => {
          return {
            ...field,
            active: selectedAll,
          }
        })
        listUpdate(update)
      }}
      value={selectedAll}
      text=""
    />
  </div>

  {#if parsedColumns?.length}
    <DraggableList
      on:change={e => {
        listUpdate(e.detail)
      }}
      on:itemChange={itemUpdate}
      items={parsedColumns || []}
      listItemKey={"field"}
      listType={FilterSetting}
      listTypeProps={{
        bindings,
      }}
    />
  {:else}
    <InfoDisplay body={"No available columns"} />
  {/if}
</div>

<style>
  .filter-configuration {
    padding-top: 8px;
  }
  .toggle-all {
    display: flex;
    justify-content: space-between;
  }
  .toggle-all :global(.spectrum-Switch) {
    margin-right: 0px;
    padding-right: calc(var(--spacing-s) - 1px);
    min-height: unset;
  }
  .toggle-all :global(.spectrum-Switch .spectrum-Switch-switch) {
    margin-top: 0px;
  }
  .toggle-all span {
    color: var(--spectrum-global-color-gray-700);
    font-size: 12px;
  }
</style>
