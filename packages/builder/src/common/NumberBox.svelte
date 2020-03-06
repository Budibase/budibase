<script>
  export let value
  export let label

  const inputChanged = ev => {
    try {
      value = Number(ev.target.value)
    } catch (_) {
      value = null
    }
  }

  let numberText = value === null || value === undefined ? "" : value.toString()
</script>

<div class="form">
  <label class="label">{label}</label>
  <div class="uk-form-controls">
    <input class="budibase__input" {value} on:change={inputChanged} />
  </div>
</div>

<style>
  .form {
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
    flex-wrap: wrap;
  }
</style>
