<script>
import Select from "../../../common/Select.svelte"

export let record
export let field
export let errors

$: isDropdown = 
    field.type === "string" 
    && field.typeOptions.values 
    && field.typeOptions.values.length > 0

$: isNumber = field.type === "number"

$: isText = 
  field.type === "string" 
  && !isDropdown

$: isCheckbox = field.type === "bool"

$: isError = errors && errors.some(e => e.field && e.field === field.name)

$: isDatetime = field.type === "datetime"

</script>

<div class="uk-margin">
  {#if !isCheckbox}
  <label class="uk-form-label" for={field.name}>{field.label}</label>
  {/if}
  <div class="uk-form-controls">
    {#if isDropdown}
      <Select bind:value={record[field.name]}>
        <option value=""></option>
        {#each field.typeOptions.values as val}
          <option value={val}>{val}</option>
        {/each}
      </Select>   
    {:else if isText}
      <input
        class="uk-input"
        class:uk-form-danger={isError}
        id={field.name}
        type="text"
        bind:value={record[field.name]} />
    {:else if isNumber}
      <input
        class="uk-input"
        class:uk-form-danger={isError}
        type="number"
        bind:value={record[field.name]} />
    {:else if isDatetime}
      <input
        class="uk-input"
        class:uk-form-danger={isError}
        type="date"
        bind:value={record[field.name]} />
    {:else if isCheckbox}
      <label>
        <input
          class="uk-checkbox"
          class:uk-form-danger={isError}
          type="checkbox"
          bind:checked={record[field.name]} >
          {field.label}
      </label>
    {/if}
  </div>
</div>