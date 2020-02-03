<script>
  export let value = ""
  export let className = ""
  export let type = "text"
  export let options = []

  export let _bb

  let actualValue = ""

  const onchange = ev => {
    if (_bb) {
      _bb.setStateFromBinding(_bb.props.value, ev.target.value)
    }
  }
</script>

<select class={className} {value} on:change={onchange}>
  <option />
  {#each options as opt}
    <option id={opt.id ? opt.id : opt.value}>{opt.value}</option>
  {/each}
</select>
