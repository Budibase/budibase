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
    grid-template-columns: 40% 1fr;
    margin-top: 8px;
    margin-bottom: 8px;
  }

  label {
    font-size: 12px;
  }
</style>
