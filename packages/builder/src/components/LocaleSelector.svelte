<script>
  import { createEventDispatcher } from "svelte"
  export let value = "en"
  const dispatch = createEventDispatcher()
  function handleLocaleChange(event) {
    event.preventDefault()
    dispatch("locale-changed", event.target.value)
  }
</script>

<div class="locale-selector">
  <div class="select">
    <select {value} on:change={handleLocaleChange}>
      <option value="en">English</option>
      <option value="ru">Русский</option>
    </select>
  </div>
</div>

<style>
  .locale-selector {
    display: flex;
    justify-content: center;
  }
  .select {
    margin: 0 1rem 1rem;
  }
</style>
