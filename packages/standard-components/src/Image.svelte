<script>
  import { buildStyle } from "./helpers"

  export let className = ""
  export let url = ""
  export let description = ""
  export let height
  export let width

  export let _bb

  $: style = buildStyle({ height, width })
</script>

<img class={className} {style} src={url} alt={description} />
