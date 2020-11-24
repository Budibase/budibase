<script>
  import { getContext } from "svelte"

  const { linkable, styleable } = getContext("sdk")
  const styles = getContext("style")

  export let url = ""
  export let text = ""
  export let openInNewTab = false

  $: target = openInNewTab ? "_blank" : "_self"
</script>

<a href={url} use:linkable {target} use:styleable={$styles}>
  {text}
  <slot />
</a>
