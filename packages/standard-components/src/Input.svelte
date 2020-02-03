<script>
  export let value = ""
  export let className = ""
  export let type = "text"

  export let _bb

  let actualValue = ""

  const onchange = ev => {
    if (_bb) {
      _bb.setStateFromBinding(_bb.props.value, ev.target.value)
    }
  }
</script>

<input class={className} {type} {value} on:change={onchange} />
