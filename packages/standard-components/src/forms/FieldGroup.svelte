<script>
  import { getContext, setContext } from "svelte"

  export let labelPosition = "above"

  const { styleable } = getContext("sdk")
  const component = getContext("component")
  setContext("fieldGroup", { labelPosition })
</script>

<div use:styleable={$component.styles}>
  <div
    class="spectrum-Form"
    class:spectrum-Form--labelsAbove={labelPosition === 'above'}>
    <slot />
  </div>
</div>
