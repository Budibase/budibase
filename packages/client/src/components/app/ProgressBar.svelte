<script>
  import { getContext } from "svelte"
  import ProgressBar from "../../../../bbui/src/ProgressBar/ProgressBar.svelte"

  const component = getContext("component")
  const { styleable } = getContext("sdk")

  export let size = "M"
  export let value = "30"
  export let progress = 30
  export let label = "Progress..."
  export let labelPosition = "above"
  export let animationDuration = 500

  let node
  let sideLabel

  $: sideLabel = labelPosition === "left" ? true : false
  $: $component.editing && node?.focus()
  $: progress = isNaN(value) || value === "" ? undefined : Number(value)
  $: animationDuration = animationDuration < 100 ? 100 : animationDuration
</script>

<div use:styleable={$component.styles}>
  <ProgressBar
    bind:this={node}
    {size}
    {sideLabel}
    duration={Number(animationDuration)}
    width="100%"
    value={Number(progress)}>{label}</ProgressBar
  >
</div>
