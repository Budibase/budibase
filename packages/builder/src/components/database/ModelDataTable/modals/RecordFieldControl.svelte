<script>
  export let type = "text"
  export let value = ""
  export let label
  export let errors = []

  const handleInput = event => {
    if (event.target.type === "checkbox") {
      value = event.target.checked;
      return;
    }

    if (event.target.type === "number") {
      value = parseInt(event.target.value);
      return;
    }

    value = event.target.value;
  }
</script>

<label>{label}</label>
<input
  class="uk-input"
  class:uk-form-danger={errors.length > 0}
  {type}
  {value}
  on:input={handleInput}
  on:change={handleInput} />
