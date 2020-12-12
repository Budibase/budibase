<script>
  import AttachmentList from "../../attachments/AttachmentList.svelte"
  export let files
</script>

<AttachmentList {files} on:delete />
