<script>
  export let type = "text"
  export let value = ""
  export let label
  export let errors = []
  export let options = []

  let checked = type === "checkbox" ? value : false

  const determineClassName = type => {
    if (type === "checkbox") return "uk-checkbox"
    if (type === "select") return "uk-select"
    return "uk-input"
  }

  const handleInput = event => {
    if (event.target.type === "checkbox") {
      value = event.target.checked
      return
    }

    if (event.target.type === "number") {
      value = parseInt(event.target.value)
      return
    }

    value = event.target.value
  }
</script>

<label>{label}</label>

{#if type === 'select'}
  <select
    data-cy="{label}-select"
    class={determineClassName(type)}
    bind:value
    class:uk-form-danger={errors.length > 0}>
    <option />
    {#each options as opt}
      <option value={opt}>{opt}</option>
    {/each}
  </select>
{:else}
  <input
    data-cy="{label}-input"
    class={determineClassName(type)}
    class:uk-form-danger={errors.length > 0}
    {checked}
    {type}
    {value}
    on:input={handleInput}
    on:change={handleInput} />
{/if}

<style>
  label {
    display: block;
    font-size: 18px;
    font-weight: 500;
    margin-bottom: 12px;
  }

  input {
    color: var(--dark-grey);
  }
</style>
