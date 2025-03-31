<script lang="ts">
  import { ActionButton, Drawer, DrawerContent, Button } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"
  import { getSchemaForDatasourcePlus } from "@/dataBinding"
  import { ServerBindingPanel as AutomationBindingPanel } from "@/components/common/bindings"
  import FilterBuilder from "@/components/design/settings/controls/FilterEditor/FilterBuilder.svelte"
  import { tables, automationStore } from "@/stores/builder"
  import type {
    AutomationStep,
    AutomationTrigger,
    BaseIOStructure,
    UISearchFilter,
  } from "@budibase/types"
  import { AutomationCustomIOType } from "@budibase/types"
  import { utils } from "@budibase/shared-core"
  import { QueryUtils, Utils, search } from "@budibase/frontend-core"
  import { cloneDeep } from "lodash"
  import { type DynamicProperties, type StepInputs } from "@/types/automations"

  export let block: AutomationStep | AutomationTrigger | undefined
  export let context
  export let bindings
  export let key

  // Mix in dynamic filter props
  type DynamicInputs = StepInputs & DynamicProperties

  const dispatch = createEventDispatcher()

  let drawer: Drawer

  $: inputData = automationStore.actions.getInputData(block)

  $: schemaProperties = Object.entries(block?.schema?.inputs?.properties || {})
  $: filters = lookForFilters(schemaProperties)
  $: filterCount =
    filters?.groups?.reduce((acc: number, group) => {
      acc = acc += group?.filters?.length || 0
      return acc
    }, 0) || 0

  $: tempFilters = cloneDeep(filters)

  $: tableId = inputData && "tableId" in inputData ? inputData.tableId : null

  $: schema = getSchemaForDatasourcePlus(tableId, {
    searchableSchema: true,
  }).schema

  $: schemaFields = search.getFields(
    $tables.list,
    Object.values(schema || {}),
    { allowLinks: false }
  )

  const lookForFilters = (
    properties: [string, BaseIOStructure][]
  ): UISearchFilter | undefined => {
    if (!properties || !inputData) {
      return
    }

    let filter: UISearchFilter | undefined

    // Does not appear in the test modal. Check testData
    const inputs = inputData as DynamicInputs
    for (let [key, field] of properties) {
      // need to look for the builder definition (keyed separately, see saveFilters)
      if (
        (field.customType === AutomationCustomIOType.FILTERS ||
          field.customType === AutomationCustomIOType.TRIGGER_FILTER) &&
        `${key}-def` in inputs
      ) {
        filter = inputs[`${key}-def`]
        break
      }
    }

    return Array.isArray(filter) ? utils.processSearchFilters(filter) : filter
  }

  function saveFilters(key: string, filters?: UISearchFilter) {
    const update = filters ? Utils.parseFilter(filters) : filters
    const query = QueryUtils.buildQuery(update)

    dispatch("change", {
      [key]: query,
      [`${key}-def`]: update, // need to store the builder definition in the automation
    })

    drawer.hide()
  }
</script>

<ActionButton fullWidth on:click={drawer.show}>
  {filterCount > 0 ? "Update Filter" : "No Filter set"}
</ActionButton>

<Drawer
  bind:this={drawer}
  title="Filtering"
  forceModal
  on:drawerShow={() => {
    tempFilters = filters
  }}
>
  <Button cta slot="buttons" on:click={() => saveFilters(key, tempFilters)}>
    Save
  </Button>

  <DrawerContent slot="body">
    <FilterBuilder
      filters={tempFilters}
      {bindings}
      {schemaFields}
      datasource={{ type: "table", tableId }}
      panel={AutomationBindingPanel}
      on:change={e => (tempFilters = e.detail)}
      evaluationContext={context}
    />
  </DrawerContent>
</Drawer>
