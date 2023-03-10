<script>
  import { getContext } from "svelte"
  import { ActionButton } from "@budibase/bbui"
  import SortButton from "./controls/SortButton.svelte"

  const { rows } = getContext("sheet")
</script>

<SortButton />
<ActionButton icon="VisibilityOff" quiet size="M">Hide fields</ActionButton>
