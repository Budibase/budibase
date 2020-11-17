<script>
  import { linkable, styleable } from "@budibase/component-sdk"

  export let url = ""
  export let text = ""
  export let openInNewTab = false
  export let styles

  $: target = openInNewTab ? "_blank" : "_self"
</script>

<a href={url} use:linkable {target} use:styleable={styles}>
  {text}
  <slot />
</a>
