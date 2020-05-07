<script>
  export let type = "text"
  export let value = ""
  export let label
  export let errors = []
  export let className = "uk-input"

  let checked = type === "checkbox" ? value : false

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
<input
  class={className}
  class:uk-form-danger={errors.length > 0}
  {checked}
  {type}
  {value}
  on:input={handleInput}
  on:change={handleInput} />
