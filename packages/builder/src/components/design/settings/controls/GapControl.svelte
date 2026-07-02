<script lang="ts">
  import { Select, Icon, Popover, ActionButton } from "@budibase/bbui"

  type GapValue = string | { column: string; row: string }

  interface Props {
    value?: GapValue
    options?: { label: string; value: string }[]
    units?: string[]
    onChange?: (value: GapValue) => void
  }

  let {
    value = "M",
    options = [],
    units = ["rem", "px", "em", "%"],
    onChange,
  }: Props = $props()

  let columnAnchor = $state<HTMLElement | undefined>(undefined)
  let rowAnchor = $state<HTMLElement | undefined>(undefined)
  let showColumnUnitMenu = $state(false)
  let showRowUnitMenu = $state(false)

  let isCustom = $derived(typeof value === "object")
  let mode = $derived(isCustom ? "custom" : value)
  let columnGap = $derived(
    isCustom && typeof value === "object" ? value.column || "0.5rem" : ""
  )
  let rowGap = $derived(
    isCustom && typeof value === "object" ? value.row || "0.5rem" : ""
  )

  let columnParsed = $derived(parseValue(columnGap))
  let columnNumeric = $derived(columnParsed.number)
  let columnUnit = $derived(columnParsed.unit)

  let rowParsed = $derived(parseValue(rowGap))
  let rowNumeric = $derived(rowParsed.number)
  let rowUnit = $derived(rowParsed.unit)

  function parseValue(val: string): { number: string; unit: string } {
    if (!val || val === "") {
      return { number: "", unit: "rem" }
    }
    const match = val.match(/^([\d.]+)(.*)$/)
    if (match) {
      return {
        number: match[1],
        unit: match[2] || "rem",
      }
    }
    return { number: val, unit: "rem" }
  }

  function handleModeChange(e: CustomEvent<GapValue>) {
    const newMode = e.detail
    if (newMode === "custom" || typeof newMode === "object") {
      onChange?.({ column: "0.5rem", row: "0.5rem" })
    } else {
      onChange?.(newMode)
    }
  }

  function handleColumnNumberInput(e: Event) {
    const num = (e.target as HTMLInputElement).value
    if (num !== "") {
      onChange?.({
        column: `${num}${columnUnit}`,
        row: rowGap || "0",
      })
    }
  }

  function handleRowNumberInput(e: Event) {
    const num = (e.target as HTMLInputElement).value
    if (num !== "") {
      onChange?.({
        column: columnGap || "0",
        row: `${num}${rowUnit}`,
      })
    }
  }

  function selectColumnUnit(unit: string) {
    if (columnNumeric) {
      onChange?.({
        column: `${columnNumeric}${unit}`,
        row: rowGap || "0",
      })
    }
    showColumnUnitMenu = false
  }

  function selectRowUnit(unit: string) {
    if (rowNumeric) {
      onChange?.({
        column: columnGap || "0",
        row: `${rowNumeric}${unit}`,
      })
    }
    showRowUnitMenu = false
  }
</script>

<div class="gap-control">
  <Select
    value={mode}
    {options}
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
          oninput={handleColumnNumberInput}
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
              <div
                class="unit-option"
                class:selected={unit === columnUnit}
                role="option"
                aria-selected={unit === columnUnit}
                onclick={() => selectColumnUnit(unit)}
                onkeydown={e => e.key === "Enter" && selectColumnUnit(unit)}
                tabindex="0"
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
          oninput={handleRowNumberInput}
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
              <div
                class="unit-option"
                class:selected={unit === rowUnit}
                role="option"
                aria-selected={unit === rowUnit}
                onclick={() => selectRowUnit(unit)}
                onkeydown={e => e.key === "Enter" && selectRowUnit(unit)}
                tabindex="0"
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
