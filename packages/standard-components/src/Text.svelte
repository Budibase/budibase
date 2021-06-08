<script>
  import { getContext } from "svelte"

  const { styleable } = getContext("sdk")
  const component = getContext("component")

  export let text = ""
  export let bold = false
  export let italic = false
  export let underline = false

  let element
</script>

<p
  bind:this={element}
  use:styleable={$component.styles}
  class:bold
  class:italic
  class:underline
>
  {text}
</p>

<style>
  p {
    display: inline-block;
    white-space: pre-wrap;
  }
  .bold {
    font-weight: bold;
  }
  .italic {
    font-style: italic;
  }
  .underline {
    text-decoration: underline;
  }
</style>
