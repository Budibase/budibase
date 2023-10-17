<script>
  import { TextArea } from "@budibase/bbui"

  export let data
  export let height
  export let minHeight = "120"

  $: string = JSON.stringify(data || {}, null, 2)
</script>

<TextArea disabled value={string} {height} {minHeight} />
