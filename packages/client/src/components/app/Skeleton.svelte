<script>
  import { getContext } from "svelte"
  import { Skeleton } from "@budibase/bbui"

  const { styleable } = getContext("sdk")
  const component = getContext("component")

  export let height
  export let width

  let styles

  $: {
    styles = JSON.parse(JSON.stringify($component.styles))

    if (!styles.normal.height && height) {
      // The height and width props provided to this component can either be numbers or strings set by users (ex. '100%', '100px', '100'). A string of '100' wouldn't be a valid CSS property, but some of our components respect that input, so we need to handle it here also, hence the `!isNaN` check.
      styles.normal.height = !isNaN(height) ? `${height}px` : height
    }

    if (!styles.normal.width && width) {
      styles.normal.width = !isNaN(width) ? `${width}px` : width
    }
  }
</script>

<div use:styleable={styles}>
  <Skeleton>
    <slot />
  </Skeleton>
</div>
