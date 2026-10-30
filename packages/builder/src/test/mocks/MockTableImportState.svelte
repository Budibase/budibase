<script lang="ts">
  import type { Row, TableSchema } from "@budibase/types"

  interface Props {
    rows?: Row[]
    schema?: TableSchema
    allValid?: boolean
    displayColumn?: string | null
  }

  let {
    rows = $bindable([]),
    schema = $bindable({}),
    allValid = $bindable(true),
    displayColumn = $bindable(null),
  }: Props = $props()

  const invalidateImport = () => {
    rows = []
    schema = {}
    displayColumn = null
    allValid = false
  }
</script>

<button type="button" onclick={invalidateImport}>Start import</button>
<button type="button" onclick={invalidateImport}>Reject import</button>
