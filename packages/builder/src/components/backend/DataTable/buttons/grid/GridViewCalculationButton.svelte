<script>
  import {
    ActionButton,
    Modal,
    ModalContent,
    Select,
    Icon,
  } from "@budibase/bbui"
  import { CalculationType, FieldType } from "@budibase/types"
  import { getContext } from "svelte"

  const { definition, datasource, rows } = getContext("grid")
  const calculationTypeOptions = [
    {
      label: "Average (mean)",
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

  let modal
  let calculations = []
  let groupings = []

  $: schema = $definition?.schema || {}

  const open = () => {
    calculations = extractCalculations(schema)
    groupings = calculations.length ? extractGroupings(schema) : []
    modal?.show()
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

  const extractGroupings = schema => {
    if (!schema) {
      return []
    }
    return Object.keys(schema)
      .filter(field => {
        return schema[field].calculationType == null && schema[field].visible
      })
      .map(field => ({ field }))
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
        // Only allow numeric fields that are not calculations themselves
        if (
          fieldSchema.calculationType ||
          fieldSchema.type !== FieldType.NUMBER
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

  // Gets the available fields to group by for a given grouping
  const getGroupingOptions = (self, groupings, schema) => {
    return Object.entries(schema)
      .filter(([field, fieldSchema]) => {
        // Don't allow grouping by calculations
        if (fieldSchema.calculationType) {
          return false
        }
        // Don't allow duplicates
        return !groupings.some(grouping => {
          return grouping !== self && grouping.field === field
        })
      })
      .map(([field]) => field)
  }

  const addCalc = () => {
    calculations = [...calculations, {}]
  }

  const deleteCalc = idx => {
    calculations = calculations.toSpliced(idx, 1)

    // Remove any groupings if clearing the last calculation
    if (!calculations.length) {
      groupings = []
    }
  }

  const addGrouping = () => {
    groupings = [...groupings, {}]
  }

  const deleteGrouping = idx => {
    groupings = groupings.toSpliced(idx, 1)
  }

  const save = async () => {
    let schema = {}

    // Prune empty stuff
    calculations = calculations.filter(calc => calc.type && calc.field)
    groupings = groupings.filter(grouping => grouping.field)

    // Add calculations
    for (let calc of calculations) {
      const name = `${calc.type} of ${calc.field}`
      schema[name] = {
        calculationType: calc.type,
        field: calc.field,
        visible: true,
      }
    }

    // Add groupings
    for (let grouping of groupings) {
      schema[grouping.field] = {
        visible: true,
      }
    }

    // Ensure primary display is visible
    let primaryDisplay = $definition.primaryDisplay
    if (!primaryDisplay || !schema[primaryDisplay]) {
      primaryDisplay = groupings[0]?.field
    }
    console.log("pd", primaryDisplay, groupings)

    // Save changes
    await datasource.actions.saveDefinition({
      ...$definition,
      primaryDisplay,
      schema,
    })
    await rows.actions.refreshData()
  }
</script>

<ActionButton icon="WebPage" quiet on:click={open}>
  Configure calculations
</ActionButton>

<Modal bind:this={modal}>
  <ModalContent
    title="Calculations"
    confirmText="Save"
    size="L"
    onConfirm={save}
  >
    {#if !calculations.length}
      <div>
        <ActionButton quiet icon="Add" on:click={addCalc}>
          Add your first calculation
        </ActionButton>
      </div>
    {:else}
      <div class="calculations">
        {#each calculations as calc, idx}
          <span>{idx === 0 ? "Calculate" : "and"} the</span>
          <Select
            options={getTypeOptions(calc, calculations)}
            bind:value={calc.type}
            placeholder="Function"
          />
          <span>of</span>
          <Select
            options={getFieldOptions(calc, calculations, schema)}
            bind:value={calc.field}
            placeholder="Column"
          />
          <Icon
            hoverable
            name="Close"
            size="S"
            on:click={() => deleteCalc(idx)}
            color="var(--spectrum-global-color-gray-700)"
          />
        {/each}
        {#each groupings as group, idx}
          <span>{idx === 0 ? "Group by" : "and"}</span>
          <Select
            options={getGroupingOptions(group, groupings, schema)}
            bind:value={group.field}
            placeholder="Column"
          />
          <Icon
            hoverable
            name="Close"
            size="S"
            on:click={() => deleteGrouping(idx)}
            color="var(--spectrum-global-color-gray-700)"
          />
          <span />
          <span />
        {/each}
      </div>
      <div class="buttons">
        <ActionButton quiet icon="Add" on:click={addCalc}>
          Add calculation
        </ActionButton>
        <ActionButton quiet icon="Add" on:click={addGrouping}>
          Group by
        </ActionButton>
      </div>
    {/if}
  </ModalContent>
</Modal>

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
  span {
    text-align: right;
  }
</style>
