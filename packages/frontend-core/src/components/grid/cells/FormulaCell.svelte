<script>
  import TextCell from "./TextCell.svelte"
  import DateCell from "./DateCell.svelte"
  import NumberCell from "./NumberCell.svelte"
  import BooleanCell from "./BooleanCell.svelte"
  import { FieldType } from "@budibase/types"

  export let schema

  $: responseType = schema.responseType
</script>

{#if responseType === FieldType.NUMBER}
  <NumberCell {...$$props} readonly />
{:else if responseType === FieldType.BOOLEAN}
  <BooleanCell {...$$props} readonly />
{:else if responseType === FieldType.DATETIME}
  <DateCell {...$$props} readonly />
{:else}
  <TextCell {...$$props} readonly />
{/if}
