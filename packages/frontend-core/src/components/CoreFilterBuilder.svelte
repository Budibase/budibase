<script>
  import {
    Body,
    Button,
    Icon,
    Layout,
    Select,
    Helpers,
    ActionButton,
  } from "@budibase/bbui"
  import {
    FieldType,
    UILogicalOperator,
    EmptyFilterOption,
  } from "@budibase/types"
  import { QueryUtils, Constants } from "@budibase/frontend-core"
  import { getContext, createEventDispatcher } from "svelte"
  import FilterField from "./FilterField.svelte"
  import ConditionField from "./ConditionField.svelte"
  import { utils } from "@budibase/shared-core"

  const dispatch = createEventDispatcher()
  const {
    OperatorOptions,
    DEFAULT_BB_DATASOURCE_ID,
    FilterOperator,
    OnEmptyFilter,
    FilterValueType,
  } = Constants

  export let schemaFields
  export let filters
  export let tables = []
  export let datasource
  export let behaviourFilters = false
  export let allowBindings = false
  export let allowOnEmpty = true
  export let builderType = "filter"
  export let docsURL = "https://docs.budibase.com/docs/searchfilter-data"

  export let bindings
  export let panel
  export let toReadable
  export let toRuntime

  $: editableFilters = migrateFilters(filters)
  $: {
    if (
      tables.find(
        table =>
          table._id === datasource?.tableId &&
          table.sourceId === DEFAULT_BB_DATASOURCE_ID
      ) &&
      !schemaFields.some(field => field.name === "_id")
    ) {
      schemaFields = [...schemaFields, { name: "_id", type: "string" }]
    }
  }
  $: prefix =
    builderType === "filter"
      ? "Show data which matches"
      : "Run branch when matching"

  // We still may need to migrate this even though the backend does it automatically now
  // for query definitions. This is because we might be editing saved filter definitions
  // from old screens, which will still be of type LegacyFilter[].
  const migrateFilters = filters => {
    if (Array.isArray(filters)) {
      return utils.processSearchFilters(filters)
    }
    return Helpers.cloneDeep(filters)
  }

  const filterOperatorOptions = Object.values(FilterOperator).map(entry => {
    return { value: entry, label: Helpers.capitalise(entry) }
  })

  const onEmptyLabelling = {
    [OnEmptyFilter.RETURN_ALL]: "All rows",
    [OnEmptyFilter.RETURN_NONE]: "No rows",
  }

  const onEmptyOptions = Object.values(OnEmptyFilter).map(entry => {
    return { value: entry, label: onEmptyLabelling[entry] }
  })

  const context = getContext("context")

  $: fieldOptions = (schemaFields || [])
    .filter(field => !field.calculationType)
    .map(field => ({
      label: field.displayName || field.name,
      value: field.name,
    }))

  const onFieldChange = filter => {
    const previousType = filter.type
    sanitizeTypes(filter)
    sanitizeOperator(filter)
    sanitizeValue(filter, previousType)
  }

  const onOperatorChange = filter => {
    sanitizeOperator(filter)
    sanitizeValue(filter, filter.type)
  }

  const getSchema = filter => {
    return schemaFields.find(field => field.name === filter.field)
  }

  const getValidOperatorsForType = filter => {
    if (builderType === "condition") {
      return [OperatorOptions.Equals, OperatorOptions.NotEquals]
    }

    if (!filter?.field && !filter?.name) {
      return []
    }

    return QueryUtils.getValidOperatorsForType(
      filter,
      filter.field || filter.name,
      datasource
    )
  }

  const sanitizeTypes = filter => {
    // Update type based on field
    const fieldSchema = schemaFields.find(x => x.name === filter.field)
    filter.type = fieldSchema?.type
    filter.subtype = fieldSchema?.subtype
    filter.formulaType = fieldSchema?.formulaType
    filter.constraints = fieldSchema?.constraints

    // Update external type based on field
    filter.externalType = getSchema(filter)?.externalType
  }

  const sanitizeOperator = filter => {
    // Ensure a valid operator is selected
    const operators = getValidOperatorsForType(filter).map(x => x.value)
    if (!operators.includes(filter.operator)) {
      filter.operator = operators[0] ?? OperatorOptions.Equals.value
    }

    // Update the noValue flag if the operator does not take a value
    const noValueOptions = [
      OperatorOptions.Empty.value,
      OperatorOptions.NotEmpty.value,
    ]
    filter.noValue = noValueOptions.includes(filter.operator)
  }

  const sanitizeValue = (filter, previousType) => {
    // Check if the operator allows a value at all
    if (filter.noValue) {
      filter.value = null
      return
    }
    // Ensure array values are properly set and cleared
    if (Array.isArray(filter.value)) {
      if (filter.valueType !== "Value" || filter.type !== FieldType.ARRAY) {
        filter.value = null
      }
    } else if (
      filter.type === FieldType.ARRAY &&
      filter.valueType === "Value"
    ) {
      filter.value = []
    } else if (
      previousType !== filter.type &&
      (previousType === FieldType.BB_REFERENCE ||
        filter.type === FieldType.BB_REFERENCE)
    ) {
      filter.value = filter.type === FieldType.ARRAY ? [] : null
    }
  }

  const getGroupPrefix = groupIdx => {
    if (groupIdx == 0) {
      return "When"
    }
    const operatorMapping = {
      [FilterOperator.ANY]: "or",
      [FilterOperator.ALL]: "and",
    }
    return operatorMapping[editableFilters.logicalOperator]
  }

  const onFilterFieldUpdate = (filter, groupIdx, filterIdx) => {
    const updated = Helpers.cloneDeep(filter)

    handleFilterChange({
      groupIdx,
      filterIdx,
      filter: { ...updated },
    })
  }

  const handleFilterChange = req => {
    const {
      groupIdx,
      filterIdx,
      filter,
      group,
      addFilter,
      addGroup,
      deleteGroup,
      deleteFilter,
      logicalOperator,
      onEmptyFilter,
    } = req

    let editable = Helpers.cloneDeep(editableFilters)
    let targetGroup = editable?.groups?.[groupIdx]
    let targetFilter = targetGroup?.filters?.[filterIdx]

    if (targetFilter) {
      if (deleteFilter) {
        targetGroup.filters.splice(filterIdx, 1)

        // Clear the group entirely if no valid filters remain
        if (targetGroup.filters.length === 0) {
          editable.groups.splice(groupIdx, 1)
        }
      } else if (filter) {
        targetGroup.filters[filterIdx] = filter
      }
    } else if (targetGroup) {
      if (deleteGroup) {
        editable.groups.splice(groupIdx, 1)
      } else if (addFilter) {
        targetGroup.filters.push({
          valueType: FilterValueType.VALUE,
          ...(builderType === "condition"
            ? { operator: OperatorOptions.Equals.value, type: FieldType.STRING }
            : {}),
        })
      } else if (group) {
        editable.groups[groupIdx] = {
          ...targetGroup,
          ...group,
        }
      }
    } else if (addGroup) {
      if (!editable?.groups?.length) {
        editable = {
          logicalOperator: UILogicalOperator.ALL,
          onEmptyFilter: EmptyFilterOption.RETURN_NONE,
          groups: [],
        }
      }
      editable.groups.push({
        logicalOperator: Constants.FilterOperator.ANY,
        filters: [
          {
            valueType: FilterValueType.VALUE,
            ...(builderType === "condition"
              ? {
                  operator: OperatorOptions.Equals.value,
                }
              : {}),
          },
        ],
      })
    } else if (logicalOperator) {
      editable = {
        ...editable,
        logicalOperator,
      }
    } else if (onEmptyFilter) {
      editable = {
        ...editable,
        onEmptyFilter,
      }
    }

    // Set the request to null if the groups are emptied
    editable = editable.groups.length ? editable : null

    dispatch("change", editable)
  }
</script>

<div class="container" class:mobile={$context?.device?.mobile}>
  <Layout noPadding>
    {#if fieldOptions?.length}
      <slot name="filtering-hero-content" />

      {#if editableFilters?.groups?.length}
        <div class="global-filter-header">
          <span>{prefix}</span>
          <span class="operator-picker">
            <Select
              value={editableFilters?.logicalOperator}
              options={filterOperatorOptions}
              getOptionLabel={opt => opt.label}
              getOptionValue={opt => opt.value}
              on:change={e => {
                handleFilterChange({
                  logicalOperator: e.detail,
                })
              }}
              placeholder={false}
            />
          </span>
          <span>of the following {builderType} groups:</span>
        </div>
      {/if}
      {#if editableFilters?.groups?.length}
        <div class="filter-groups">
          {#each editableFilters?.groups as group, groupIdx}
            <div class="group">
              <div class="group-header">
                <div class="group-options">
                  <span>
                    {getGroupPrefix(groupIdx, editableFilters.logicalOperator)}
                  </span>
                  <span class="operator-picker">
                    <Select
                      value={group?.logicalOperator}
                      options={filterOperatorOptions}
                      getOptionLabel={opt => opt.label}
                      getOptionValue={opt => opt.value}
                      on:change={e => {
                        handleFilterChange({
                          groupIdx,
                          group: {
                            logicalOperator: e.detail,
                          },
                        })
                      }}
                      placeholder={false}
                    />
                  </span>
                  <span>of the following {builderType}s are matched:</span>
                </div>
                <div class="group-actions">
                  <Icon
                    name="Add"
                    hoverable
                    hoverColor="var(--ink)"
                    on:click={() => {
                      handleFilterChange({
                        groupIdx,
                        addFilter: true,
                      })
                    }}
                  />
                  <Icon
                    name="Delete"
                    hoverable
                    hoverColor="var(--ink)"
                    on:click={() => {
                      handleFilterChange({
                        groupIdx,
                        deleteGroup: true,
                      })
                    }}
                  />
                </div>
              </div>

              <div class="filters">
                {#each group.filters as filter, filterIdx}
                  <div class="filter">
                    {#if builderType === "filter"}
                      <Select
                        value={filter.field}
                        options={fieldOptions}
                        on:change={e => {
                          const updated = { ...filter, field: e.detail }
                          onFieldChange(updated)
                          onFilterFieldUpdate(updated, groupIdx, filterIdx)
                        }}
                        placeholder="Column"
                      />
                    {:else}
                      <ConditionField
                        placeholder="Value"
                        {filter}
                        drawerTitle={"Edit Binding"}
                        {bindings}
                        {panel}
                        {toReadable}
                        {toRuntime}
                        on:change={e => {
                          const updated = {
                            ...filter,
                            field: e.detail.field,
                          }
                          onFilterFieldUpdate(updated, groupIdx, filterIdx)
                        }}
                      />
                    {/if}
                    <Select
                      value={filter.operator}
                      disabled={!filter.field && builderType === "filter"}
                      options={getValidOperatorsForType(filter)}
                      on:change={e => {
                        const updated = { ...filter, operator: e.detail }
                        onOperatorChange(updated)
                        onFilterFieldUpdate(updated, groupIdx, filterIdx)
                      }}
                      placeholder={false}
                    />
                    <FilterField
                      placeholder="Value"
                      disabled={!filter.field && builderType === "filter"}
                      drawerTitle={builderType === "condition"
                        ? "Edit binding"
                        : null}
                      {allowBindings}
                      filter={{
                        ...filter,
                        ...(builderType === "condition"
                          ? { type: FieldType.STRING }
                          : {}),
                      }}
                      {schemaFields}
                      {bindings}
                      {panel}
                      {toReadable}
                      {toRuntime}
                      on:change={e => {
                        onFilterFieldUpdate(
                          { ...filter, ...e.detail },
                          groupIdx,
                          filterIdx
                        )
                      }}
                    />

                    <ActionButton
                      size="M"
                      icon="Delete"
                      on:click={() => {
                        handleFilterChange({
                          groupIdx,
                          filterIdx,
                          deleteFilter: true,
                        })
                      }}
                    />
                  </div>
                {/each}
              </div>
            </div>
          {/each}
        </div>
      {/if}

      <div class="filters-footer">
        <Layout noPadding>
          {#if behaviourFilters && allowOnEmpty && editableFilters?.groups?.length}
            <div class="empty-filter">
              <span>Return</span>
              <span class="empty-filter-picker">
                <Select
                  value={editableFilters?.onEmptyFilter}
                  options={onEmptyOptions}
                  getOptionLabel={opt => opt.label}
                  getOptionValue={opt => opt.value}
                  on:change={e => {
                    handleFilterChange({
                      onEmptyFilter: e.detail,
                    })
                  }}
                  placeholder={false}
                />
              </span>
              <span>when all {builderType}s are empty</span>
            </div>
          {/if}
          <div class="add-group">
            <Button
              icon="AddCircle"
              size="M"
              secondary
              on:click={() => {
                handleFilterChange({
                  addGroup: true,
                })
              }}
            >
              Add {builderType} group
            </Button>
            {#if docsURL}
              <a href={docsURL} target="_blank">
                <Icon
                  name="HelpOutline"
                  color="var(--spectrum-global-color-gray-600)"
                />
              </a>
            {/if}
          </div>
        </Layout>
      </div>
    {:else}
      <Body size="S">None of the table column can be used for filtering.</Body>
    {/if}
  </Layout>
</div>

<style>
  .group-actions {
    display: flex;
    gap: var(--spacing-m);
  }

  .global-filter-header,
  .empty-filter,
  .group-options {
    display: flex;
    gap: var(--spacing-m);
    align-items: center;
  }

  .group-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .operator-picker {
    width: 72px;
  }

  .empty-filter-picker {
    width: 92px;
  }

  .filter-groups {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xl);
  }

  .group {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-l);
    border: 1px solid var(--spectrum-global-color-gray-400);
    border-radius: 4px;
    padding: var(--spacing-xl);
  }

  .filters {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-l);
  }

  .filter {
    display: grid;
    gap: var(--spacing-l);
    grid-template-columns: minmax(150px, 1fr) 170px minmax(200px, 1fr) 40px 40px;
  }

  .filters-footer {
    display: flex;
    gap: var(--spacing-xl);
    flex-direction: column;
  }

  .add-group {
    display: flex;
    gap: var(--spacing-m);
    align-items: center;
  }

  .container {
    width: 100%;
  }
</style>
