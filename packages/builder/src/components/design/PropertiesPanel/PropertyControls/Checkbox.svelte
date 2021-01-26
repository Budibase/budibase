<script>
  import Checkbox from "components/common/Checkbox.svelte"

  export let value
</script>

<Checkbox checked={value} on:change />
