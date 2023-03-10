<script>
  import { getContext } from "svelte"
  import { ActionButton } from "@budibase/bbui"

  const { rows } = getContext("sheet")
</script>

<ActionButton icon="SortOrderDown" quiet size="M">Sort</ActionButton>
<ActionButton icon="VisibilityOff" quiet size="M">Hide fields</ActionButton>
