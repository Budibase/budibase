<script>
  import Colorpicker from "@budibase/colorpicker"

  export let value
</script>

<Colorpicker value={value || '#000'} on:change />
