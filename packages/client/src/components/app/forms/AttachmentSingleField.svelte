<script>
  import { FieldType } from "@budibase/types"
  import AttachmentField from "./AttachmentField.svelte"

  const fieldApiMapper = {
    get: value => (!Array.isArray(value) && value ? [value] : value) || [],
    set: value => value[0] || null,
  }
</script>

<AttachmentField
  {...$$restProps}
  type={FieldType.ATTACHMENT_SINGLE}
  maximum={1}
  defaultValue={null}
  {fieldApiMapper}
/>
