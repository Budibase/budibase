<script>
  import { ActionButton } from "@budibase/bbui"

  export let hideAutocolumns

  function hideOrUnhide() {
    hideAutocolumns = !hideAutocolumns
  }
</script>

<ActionButton
  icon={hideAutocolumns ? "VisibilityOff" : "Visibility"}
  primary
  quiet
  on:click={hideOrUnhide}
>
  Auto columns
</ActionButton>
