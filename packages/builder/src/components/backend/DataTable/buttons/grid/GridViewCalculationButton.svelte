<script>
  import {
    ActionButton,
    Select,
    Icon,
    Multiselect,
    Button,
  } from "@budibase/bbui"
  import { CalculationType, canGroupBy, isNumeric } from "@budibase/types"
  import InfoDisplay from "@/pages/builder/app/[application]/design/[screenId]/[componentId]/_components/Component/InfoDisplay.svelte"
  import { getContext } from "svelte"
  import DetailPopover from "@/components/common/DetailPopover.svelte"

  const { definition, datasource, rows } = getContext("grid")
  const calculationTypeOptions = [
    {
      label: "Average",
      value: CalculationType.AVG,
    },
    {
      label: "Sum",
      value: CalculationType.SUM,
    },
    {
      label: "Minimum",
      value: CalculationType.MIN,
    },
    {
      label: "Maximum",
      value: CalculationType.MAX,
    },
    {
      label: "Count",
      value: CalculationType.COUNT,
    },
  ]

  let popover
  let calculations = []
  let groupBy = []
  let schema = {}
  let loading = false

  $: schema = $definition?.schema || {}
  $: count = extractCalculations($definition?.schema || {}).length
  $: groupByOptions = getGroupByOptions(schema)

  const openPopover = () => {
    calculations = extractCalculations(schema)
    groupBy = calculations.length ? extractGroupBy(schema) : []
    popover?.show()
  }

  const extractCalculations = schema => {
    if (!schema) {
      return []
    }
    return Object.keys(schema)
      .filter(field => {
        return schema[field].calculationType != null
      })
      .map(field => ({
        type: schema[field].calculationType,
        field: schema[field].field,
      }))
  }

  const extractGroupBy = schema => {
    if (!schema) {
      return []
    }
    return Object.keys(schema).filter(field => {
      return schema[field].calculationType == null && schema[field].visible
    })
  }

  // Gets the available types for a given calculation
  const getTypeOptions = (self, calculations) => {
    return calculationTypeOptions.filter(option => {
      return !calculations.some(
        calc =>
          calc !== self &&
          calc.field === self.field &&
          calc.type === option.value
      )
    })
  }

  // Gets the available fields for a given calculation
  const getFieldOptions = (self, calculations, schema) => {
    return Object.entries(schema)
      .filter(([field, fieldSchema]) => {
        // Don't allow other calculation columns
        if (fieldSchema.calculationType) {
          return false
        }
        // Only allow numeric columns for most calculation types
        if (
          self.type !== CalculationType.COUNT &&
          !isNumeric(fieldSchema.type)
        ) {
          return false
        }
        // Don't allow duplicates
        return !calculations.some(calc => {
          return (
            calc !== self && calc.type === self.type && calc.field === field
          )
        })
      })
      .map(([field]) => field)
  }

  // Gets the available fields to group by
  const getGroupByOptions = schema => {
    return Object.entries(schema)
      .filter(([_, fieldSchema]) => {
        // Don't allow grouping by calculations
        if (fieldSchema.calculationType) {
          return false
        }
        // Don't allow complex types
        return canGroupBy(fieldSchema.type)
      })
      .map(([field]) => field)
  }

  const addCalc = () => {
    calculations = [...calculations, { type: CalculationType.AVG }]
  }

  const deleteCalc = idx => {
    calculations = calculations.toSpliced(idx, 1)

    // Remove any grouping if clearing the last calculation
    if (!calculations.length) {
      groupBy = []
    }
  }

  const save = async () => {
    let newSchema = {}
    loading = true

    // Add calculations
    for (let calc of calculations) {
      if (!calc.type || !calc.field) {
        continue
      }
      const typeOption = calculationTypeOptions.find(x => x.value === calc.type)
      const name = `${typeOption.label} ${calc.field}`
      newSchema[name] = {
        calculationType: calc.type,
        field: calc.field,
        visible: true,
      }
    }

    // Add other fields
    for (let field of Object.keys(schema)) {
      if (schema[field].calculationType) {
        continue
      }
      newSchema[field] = {
        ...schema[field],
        visible: groupBy.includes(field),
      }
    }

    // Ensure primary display is valid
    let primaryDisplay = $definition.primaryDisplay
    if (!primaryDisplay || !newSchema[primaryDisplay]?.visible) {
      primaryDisplay = groupBy[0]
    }

    // Save changes
    try {
      await datasource.actions.saveDefinition({
        ...$definition,
        primaryDisplay,
        schema: newSchema,
      })
      await rows.actions.refreshData()
    } finally {
      loading = false
      popover.hide()
    }
  }
</script>

<DetailPopover bind:this={popover} title="Configure calculations" width={480}>
  <svelte:fragment slot="anchor" let:open>
    <ActionButton icon="WebPage" quiet on:click={openPopover} selected={open}>
      Configure calculations{count ? `: ${count}` : ""}
    </ActionButton>
  </svelte:fragment>

  {#if calculations.length}
    <div class="calculations">
      {#each calculations as calc, idx}
        <span>{idx === 0 ? "Calculate" : "and"} the</span>
        <Select
          options={getTypeOptions(calc, calculations)}
          bind:value={calc.type}
          placeholder={false}
        />
        <span>of</span>
        <Select
          options={getFieldOptions(calc, calculations, schema)}
          bind:value={calc.field}
          placeholder="Column"
        />
        <Icon
          hoverable
          name="Delete"
          size="S"
          on:click={() => deleteCalc(idx)}
          color="var(--spectrum-global-color-gray-700)"
        />
      {/each}
      <span>Group by</span>
      <div class="group-by">
        <Multiselect
          options={groupByOptions}
          bind:value={groupBy}
          placeholder="None"
        />
      </div>
    </div>
  {/if}
  <div class="buttons">
    <ActionButton
      quiet
      icon="Add"
      on:click={addCalc}
      disabled={calculations.length >= 5}
    >
      Add calculation
    </ActionButton>
  </div>
  <InfoDisplay
    icon="Help"
    quiet
    body="Most calculations only work with numeric columns and a maximum of 5 calculations can be added at once."
  />

  <div>
    <Button cta on:click={save} disabled={loading}>Save</Button>
  </div>
</DetailPopover>

<style>
  .calculations {
    display: grid;
    grid-template-columns: auto 1fr auto 1fr auto;
    align-items: center;
    column-gap: var(--spacing-m);
    row-gap: var(--spacing-m);
  }
  .buttons {
    display: flex;
    flex-direction: row;
  }
  .group-by {
    grid-column: 2 / 5;
  }
</style>
