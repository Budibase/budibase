<script>
  export let checked = false
  export let label = ""
</script>

<div class="checkbox-container">
<input class="uk-checkbox" type="checkbox" bind:checked on:change />
{label}
</div>

<style>

.checkbox-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 20px;

}
  input {
    margin-right: 10px;
  }
</style>
