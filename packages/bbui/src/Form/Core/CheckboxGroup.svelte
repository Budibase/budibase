<script lang="ts" context="module">
  type O = any
  type V = any
</script>

<script lang="ts" generics="O, V">
  import "@spectrum-css/fieldgroup/dist/index-vars.css"
  import "@spectrum-css/radio/dist/index-vars.css"
  import { createEventDispatcher } from "svelte"
  import Icon from "../../Icon/Icon.svelte"

  export let direction: "horizontal" | "vertical" = "vertical"
  export let value: V[] = []
  export let options: O[] = []
  export let disabled = false
  export let readonly = false
  export let getOptionLabel = (option: O) => `${option}`
  export let getOptionValue = (option: O) => option as unknown as V
  export let showSelectAll = false
  export let selectAllText = "Select all"

  const dispatch = createEventDispatcher<{ change: V[] }>()

  const onChange = (optionValue: V) => {
    if (!value.includes(optionValue)) {
      dispatch("change", [...value, optionValue])
    } else {
      dispatch(
        "change",
        value.filter(x => x !== optionValue)
      )
    }
  }

  $: allSelected =
    options.length > 0 &&
    options.every(option => value.includes(getOptionValue(option)))
  $: noneSelected =
    options.length === 0 ||
    options.every(option => !value.includes(getOptionValue(option)))
  $: indeterminate = !allSelected && !noneSelected

  const toggleSelectAll = () => {
    if (allSelected) {
      dispatch("change", [])
    } else {
      const allValues = options.map(option => getOptionValue(option))
      dispatch("change", allValues)
    }
  }
</script>

<div class={`spectrum-FieldGroup spectrum-FieldGroup--${direction}`}>
  {#if showSelectAll && options?.length > 0}
    <div
      title={selectAllText}
      class="spectrum-Checkbox spectrum-FieldGroup-item select-all-checkbox"
      class:readonly
    >
      <label
        class="spectrum-Checkbox spectrum-Checkbox--sizeM spectrum-FieldGroup-item"
      >
        <input
          on:change={toggleSelectAll}
          type="checkbox"
          class="spectrum-Checkbox-input"
          checked={allSelected}
          {disabled}
        />
        <span class="spectrum-Checkbox-box">
          <span class="icon" class:checked={allSelected || indeterminate}>
            <Icon
              name={indeterminate ? "minus" : "check"}
              weight="bold"
              color="var(--spectrum-global-color-gray-50)"
            />
          </span>
        </span>
        <span class="spectrum-Checkbox-label">{selectAllText}</span>
      </label>
    </div>
  {/if}
  {#if options && Array.isArray(options)}
    {#each options as option}
      {@const optionValue = getOptionValue(option)}
      {@const checked = value.includes(optionValue)}
      <div
        title={getOptionLabel(option)}
        class="spectrum-Checkbox spectrum-FieldGroup-item"
        class:readonly
      >
        <label
          class="spectrum-Checkbox spectrum-Checkbox--sizeM spectrum-FieldGroup-item"
        >
          <input
            on:change={() => onChange(optionValue)}
            type="checkbox"
            class="spectrum-Checkbox-input"
            {checked}
            {disabled}
          />
          <span class="spectrum-Checkbox-box">
            <span class="icon" class:checked>
              <Icon
                name="check"
                weight="bold"
                color="var(--spectrum-global-color-gray-50)"
              />
            </span>
          </span>
          <span class="spectrum-Checkbox-label">{getOptionLabel(option)}</span>
        </label>
      </div>
    {/each}
  {/if}
</div>

<style>
  .spectrum-Checkbox-input {
    opacity: 0;
  }
  .readonly {
    pointer-events: none;
  }
  .icon {
    display: none;
    left: 50%;
    top: 50%;
    position: absolute;
    transform: translate(-50%, -50%);
  }
  .icon.checked {
    display: block;
  }
  .icon :global(i) {
    font-size: 14px;
  }
  .select-all-checkbox {
    margin-bottom: 8px;
    padding: 0;
  }
  .select-all-checkbox .spectrum-Checkbox {
    padding: 0;
  }
  .select-all-checkbox .spectrum-Checkbox-input {
    margin: 0;
  }
  .spectrum-FieldGroup .select-all-checkbox,
  .spectrum-FieldGroup .select-all-checkbox:hover,
  .spectrum-FieldGroup .select-all-checkbox:focus-within,
  .spectrum-FieldGroup .select-all-checkbox .spectrum-Checkbox,
  .spectrum-FieldGroup .select-all-checkbox label {
    background: none !important;
  }
</style>
