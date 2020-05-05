<script>
  export let value = ""
  export let onChange = value => {}
  export let options = []
</script>

<select
  class="uk-select uk-form-small"
  {value}
  on:change={ev => onChange(ev.target.value)}>
  {#each options || [] as option}
    <option value={option}>{option}</option>
  {/each}
</select>
