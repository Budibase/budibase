<script>
  import { onMount } from "svelte"

  import FlatButton from "./FlatButton.svelte"
  export let buttonProps = []
  export let isMultiSelect = false
  export let value = []
  export let initialValue = ""
  export let onChange = selected => {}

  onMount(() => {
    if (!value && !!initialValue) {
      value = initialValue
    }
  })

  function onButtonClicked(v) {
    let val
    if (isMultiSelect) {
      if (value.includes(v)) {
        let idx = value.findIndex(i => i === v)
        val = [...value].splice(idx, 1)
      } else {
        val = [...value, v]
      }
    } else {
      val = v
    }
    onChange(val)
  }
</script>

<div class="flatbutton-group">
  {#each buttonProps as props}
    <div class="button-container">
      <FlatButton
        selected={value.includes(props.value)}
        onClick={onButtonClicked}
        {...props} />
    </div>
  {/each}
</div>

<style>
  .flatbutton-group {
    display: flex;
    flex-flow: row nowrap;
  }

  .button-container {
    flex: 1;
    margin: 5px;
  }
</style>
