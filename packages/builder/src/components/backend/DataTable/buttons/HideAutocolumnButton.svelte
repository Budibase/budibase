<script>
  import { ActionButton } from "@budibase/bbui"
  import { _ } from "../../../../../lang/i18n"

  export let hideAutocolumns

  function hideOrUnhide() {
    hideAutocolumns = !hideAutocolumns
  }
</script>

<ActionButton
  icon={hideAutocolumns ? "VisibilityOff" : "Visibility"}
  primary
  size="S"
  quiet
  on:click={hideOrUnhide}
>
  {$_("components.backend.DataTable.buttons.HideAutocolumnButton.Auto_columns")}
</ActionButton>
