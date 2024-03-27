<script>
  import { FieldType } from "@budibase/types"
  import AttachmentField from "./AttachmentField.svelte"
</script>

<AttachmentField {...$$restProps} type={FieldType.ATTACHMENT_SINGLE} />
