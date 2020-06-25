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

<div class="numberbox">
  <label>{label}</label>
  <input
    class="budibase__input"
    type="number"
    {value}
    on:change={inputChanged} />
</div>

<style>
  .numberbox {
    display: grid;
    align-items: center;
    margin-bottom: 16px;
  }

  label {
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 8px;
  }
</style>
