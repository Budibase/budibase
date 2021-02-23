<script>
  import { getContext } from "svelte"

  const { styleable } = getContext("sdk")
  const component = getContext("component")

  export let text = ""
</script>

<p use:styleable={$component.styles}>{text}</p>

<style>
  p {
    display: inline-block;
    white-space: pre-wrap;
  }
</style>
