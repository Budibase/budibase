<script>
  import { Select, Icon, Popover, ActionButton } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"

  export let value = "M"

  const dispatch = createEventDispatcher()
  const units = ["rem", "px", "em", "%"]

  const presetOptions = [
    { label: "None", value: "N" },
    { label: "Small", value: "S" },
    { label: "Medium", value: "M" },
    { label: "Large", value: "L" },
    { label: "Custom", value: "custom" },
  ]

  $: isCustom = typeof value === "object"
  $: mode = isCustom ? "custom" : value
  $: columnGap = isCustom ? value?.column || "0.5rem" : ""
  $: rowGap = isCustom ? value?.row || "0.5rem" : ""

  // Parse column gap
  $: columnParsed = parseValue(columnGap)
  $: columnNumeric = columnParsed.number
  $: columnUnit = columnParsed.unit

  // Parse row gap
  $: rowParsed = parseValue(rowGap)
  $: rowNumeric = rowParsed.number
  $: rowUnit = rowParsed.unit

  let columnAnchor, rowAnchor
  let showColumnUnitMenu = false
  let showRowUnitMenu = false

  function parseValue(val) {
    if (!val || val === "") {
      return { number: "", unit: "rem" }
    }
    const match = String(val).match(/^([\d.]+)(.*)$/)
    if (match) {
      return {
        number: match[1],
        unit: match[2] || "rem",
      }
    }
    return { number: val, unit: "rem" }
  }

  function handleModeChange(e) {
    const newMode = e.detail
    if (newMode === "custom") {
      dispatch("change", { column: "0.5rem", row: "0.5rem" })
    } else {
      dispatch("change", newMode)
    }
  }

  function handleColumnNumberInput(e) {
    const num = e.target.value
    if (num !== "") {
      const newValue = `${num}${columnUnit}`
      dispatch("change", {
        column: newValue,
        row: rowGap || "0",
      })
    }
  }

  function handleRowNumberInput(e) {
    const num = e.target.value
    if (num !== "") {
      const newValue = `${num}${rowUnit}`
      dispatch("change", {
        column: columnGap || "0",
        row: newValue,
      })
    }
  }

  function selectColumnUnit(unit) {
    if (columnNumeric) {
      const newValue = `${columnNumeric}${unit}`
      dispatch("change", {
        column: newValue,
        row: rowGap || "0",
      })
    }
    showColumnUnitMenu = false
  }

  function selectRowUnit(unit) {
    if (rowNumeric) {
      const newValue = `${rowNumeric}${unit}`
      dispatch("change", {
        column: columnGap || "0",
        row: newValue,
      })
    }
    showRowUnitMenu = false
  }
</script>

<div class="gap-control">
  <Select
    value={mode}
    options={presetOptions}
    on:change={handleModeChange}
    placeholder={false}
  />
</div>

{#if isCustom}
  <div class="custom-gaps">
    <!-- Column Gap Input -->
    <div class="gap-row">
      <div class="gap-input-wrapper">
        <div class="gap-label">Column-Gap</div>
        <div class="icon-box">
          <Icon name="split-horizontal" />
        </div>
        <input
          type="number"
          class="gap-number-input"
          value={columnNumeric}
          placeholder="0.5"
          step="0.1"
          min="0"
          on:input={handleColumnNumberInput}
        />
        <div bind:this={columnAnchor}>
          <ActionButton
            size="M"
            quiet
            on:click={() => (showColumnUnitMenu = !showColumnUnitMenu)}
          >
            {columnUnit.toUpperCase()}
          </ActionButton>
        </div>
        <Popover
          bind:open={showColumnUnitMenu}
          anchor={columnAnchor}
          align="right"
        >
          <div class="unit-menu">
            {#each units as unit}
              <!-- svelte-ignore a11y-no-static-element-interactions -->
              <!-- svelte-ignore a11y-click-events-have-key-events -->
              <div
                class="unit-option"
                class:selected={unit === columnUnit}
                on:click={() => selectColumnUnit(unit)}
              >
                {unit.toUpperCase()}
              </div>
            {/each}
          </div>
        </Popover>
      </div>
    </div>

    <!-- Row Gap Input -->
    <div class="gap-row">
      <div class="gap-input-wrapper">
        <div class="gap-label">Row-Gap</div>
        <div class="icon-box">
          <Icon name="split-vertical" />
        </div>
        <input
          type="number"
          class="gap-number-input"
          value={rowNumeric}
          placeholder="0.5"
          step="0.1"
          min="0"
          on:input={handleRowNumberInput}
        />
        <div bind:this={rowAnchor}>
          <ActionButton
            size="M"
            quiet
            on:click={() => (showRowUnitMenu = !showRowUnitMenu)}
          >
            {rowUnit.toUpperCase()}
          </ActionButton>
        </div>
        <Popover bind:open={showRowUnitMenu} anchor={rowAnchor} align="right">
          <div class="unit-menu">
            {#each units as unit}
              <!-- svelte-ignore a11y-no-static-element-interactions -->
              <!-- svelte-ignore a11y-click-events-have-key-events -->
              <div
                class="unit-option"
                class:selected={unit === rowUnit}
                on:click={() => selectRowUnit(unit)}
              >
                {unit.toUpperCase()}
              </div>
            {/each}
          </div>
        </Popover>
      </div>
    </div>
  </div>
{/if}

<style>
  .gap-control {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .custom-gaps {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .gap-row {
    display: flex;
    align-items: center;
  }

  .gap-label {
    font-size: 12px;
    font-weight: 500;
    color: var(--spectrum-global-color-gray-700);
    white-space: nowrap;
    margin-right: 12px;
    min-width: 78px;
  }

  .gap-input-wrapper {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
  }

  .icon-box {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: 0px solid var(--spectrum-global-color-gray-300);
    border-radius: 4px;
    background-color: transparent;
    flex-shrink: 0;
  }

  .icon-box :global(svg) {
    width: 16px;
    height: 16px;
    color: var(--spectrum-global-color-gray-600);
  }

  .gap-number-input {
    width: 60px;
    height: 32px;
    border: 1px solid var(--spectrum-global-color-gray-400);
    border-radius: 4px;
    padding: 0 8px;
    font-size: 14px;
    background-color: var(--spectrum-global-color-gray-50);
    color: var(--spectrum-global-color-gray-900);
  }

  .gap-number-input:focus {
    outline: none;
    border-color: var(--spectrum-global-color-blue-400);
    background-color: var(--spectrum-global-color-gray-75);
  }

  .gap-number-input::-webkit-inner-spin-button,
  .gap-number-input::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  .unit-menu {
    display: flex;
    flex-direction: column;
    min-width: 80px;
  }

  .unit-option {
    padding: 8px 12px;
    cursor: pointer;
    font-size: 13px;
    color: var(--spectrum-global-color-gray-800);
    transition: background-color 130ms ease-out;
  }

  .unit-option:hover {
    background-color: var(--spectrum-global-color-gray-200);
  }

  .unit-option.selected {
    background-color: var(--spectrum-global-color-blue-400);
    color: white;
  }
</style>
