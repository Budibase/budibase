<script>
  import { getContext } from "svelte"

  const { styleable } = getContext("sdk")
  const component = getContext("component")

  export let icon = ""
  export let size = "fa-lg"
  export let color = "#f00"

  $: styles = {
    ...$component.styles,
    normal: {
      ...$component.styles.normal,
      color,
    },
  }
</script>

<i use:styleable={styles} class="{icon} {size}" />
