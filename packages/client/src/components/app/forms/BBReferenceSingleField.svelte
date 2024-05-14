<script>
  import { FieldType } from "@budibase/types"
  import BBReferenceField from "./BBReferenceField.svelte"
</script>

<BBReferenceField {...$$restProps} type={FieldType.BB_REFERENCE_SINGLE} />
