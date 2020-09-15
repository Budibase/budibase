<script>
  export let value = ""
  export let className = ""

  export let _bb

  let actualValue = ""
  let selectElement

  $: selectElement && _bb.attachChildren(selectElement)

  const onchange = ev => {
    if (_bb) {
      _bb.setBinding("value", ev.target.value)
    }
  }
</script>

<select class={className} {value} on:change={onchange} bind:this={selectElement} />
