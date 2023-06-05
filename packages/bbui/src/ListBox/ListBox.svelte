<script>
  import "@spectrum-css/fieldgroup/dist/index-vars.css"
  import "@spectrum-css/radio/dist/index-vars.css"
  import { createEventDispatcher } from "svelte"
  import Checkbox from "./Checkbox.svelte"

  export let value = []
  export let options = []
  export let disabled = false

  export let showSelectAll = true
  export let selectAllText = "Select all"

  const dispatch = createEventDispatcher()
  const onChange = e => {
    const target = e.detail.target
    let tempValue = value
    let isChecked = target.checked

    const isIncluded = tempValue.includes(target.value)

    if (!isIncluded && isChecked) {
      tempValue.push(target.value)
    } else if (!isChecked && isIncluded) {
      tempValue.splice(tempValue.indexOf(target.value), 1)
    }
    value = tempValue
  }

  $: dispatch("change", value)

  let allSelected = false
  $: {
    if (value.length === options.length) {
      allSelected = true
    } else if (value.length === 0) {
      allSelected = false
    } else {
      allSelected = "partial"
    }
  }

  const toggleSelectAll = () => {
    if (allSelected === true) {
      value = []
    } else {
      value = [...options]
    }
  }
</script>

<div class={`spectrum-FieldGroup spectrum-FieldGroup--vertical`}>
  {#if options && Array.isArray(options)}
    {#if showSelectAll}
      <div class="CheckBoxItem">
        <Checkbox
          value={allSelected}
          on:change={toggleSelectAll}
          {disabled}
          text={selectAllText}
        />
      </div>
    {/if}
    {#each options as option}
      <div
        title={option}
        class={`spectrum-Checkbox spectrum-FieldGroup-item CheckBoxItem`}
      >
        <Checkbox
          on:change={onChange}
          {disabled}
          value={value.includes(option)}
          text={option}
          dispatchFullEvent
        />
      </div>
    {/each}
  {/if}
</div>

<style>
  .spectrum-FieldGroup {
    width: 100%;
    border: 1px solid var(--spectrum-global-color-gray-300);
    border-radius: 4px;
  }

  .spectrum-Checkbox-input {
    opacity: 0;
  }

  .CheckBoxGroup {
    width: 100%;
  }

  .CheckBoxItem:hover {
    background-color: rgba(255, 255, 255, 0.01);
  }
</style>
