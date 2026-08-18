<script lang="ts">
  import { ActionButton } from "@budibase/bbui"
  import type { RestTemplate } from "@budibase/types"
  import { bb } from "@/stores/bb"

  export let row: RestTemplate
</script>

<ActionButton
  size="S"
  on:click={() => bb.settings(`/connections/apis/new/${row.id}`)}
>
  Connect
</ActionButton>
