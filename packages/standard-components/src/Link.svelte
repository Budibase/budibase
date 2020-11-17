<script>
  import { linkable } from "@budibase/component-sdk"

  export let url = ""
  export let text = ""
  export let openInNewTab = false

  $: target = openInNewTab ? "_blank" : "_self"
</script>

<a href={url} use:linkable {target}>
  {text}
  <slot />
</a>
