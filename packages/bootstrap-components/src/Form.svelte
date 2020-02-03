<script>
  export let formControls = []

  export let _bb

  let htmlElements = {}
  let labelElements = {}
  let labels = {}
  let isInitialised = false

  $: {
    if (_bb && htmlElements && !isInitialised) {
      let cIndex = 0
      for (let c of formControls) {
        labels[cIndex] = c.label
        cIndex++
      }

      for (let el in htmlElements) {
        if (formControls[el].control.controlPosition === "Before Label") {
          _bb.insertChildren(
            _bb.props.formControls[el].control,
            htmlElements[el],
            htmlElements[el].childNodes.find(n => n.tagName === "LABEL")
          )
        } else {
          _bb.appendChildren(
            _bb.props.formControls[el].control,
            htmlElements[el]
          )
        }
      }
      isInitialised = true
    }
  }
</script>

<form>
  {#each formControls as child, idx}
    <div class="form-group" bind:this={htmlElements[idx]}>
      <label>{labels[idx]}</label>
    </div>
  {/each}
</form>
