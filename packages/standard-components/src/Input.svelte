<script>
  export let id = ""
  export let value = ""
  export let className = ""
  export let type = "text"
  export let label = ""
  export let checked = false

  export let _bb

  let actualValue = ""

  const onchange = ev => {
    if (_bb) {
      _bb.setBinding("value", ev.target.value)
    }
  }
</script>

<label for={id}>{label}</label>
<input {id} class={className} {type} {value} {checked} on:change={onchange} />
