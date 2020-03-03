<script>
  import "@material/select/helper-text/mdc-select-helper-text"
  import { onMount } from "svelte"
  import { MDCSelectHelperText } from "@material/select/helper-text"
  import ClassBuilder from "../ClassBuilder.js"

  const cb = new ClassBuilder("select-helper-text")

  let helperText
  let instance

  export let id = ""
  export let text = ""
  export let persistent = false

  onMount(() => {
    if (!!helperText) {
      instance = new MDCSelectHelperText(helperText)
      return () => {
        instance && instance.destroy()
        instance = null
      }
    }
  })

  $: modifiers = { persistent }
  $: props = { modifiers }
  $: helperClass = cb.build({ props })
</script>

<p bind:this={helperText} {id} class={helperClass}>{text}</p>
