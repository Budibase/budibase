<script lang="ts">
  import "@spectrum-css/dialog/dist/index-vars.css"
  import { ActionButton, Body, Modal, ModalContent } from "@budibase/bbui"
  import MicrosoftSharepointLogo from "assets/rest-template-icons/microsoft-sharepoint.svg"
  import { featureFlags } from "@/stores/portal"
  import { FeatureFlag } from "@budibase/types"

  export interface Props {
    MAX_FILE_SIZE_LABEL: string
    isUploading?: boolean
    onUpload?: () => void
    onSharePoint?: () => Promise<void>
  }

  let {
    onUpload,
    onSharePoint,
    MAX_FILE_SIZE_LABEL,
    isUploading = false,
  }: Props = $props()

  let modal = $state<Modal>()
  let loading = $state(false)

  export function show() {
    modal?.show()
  }

  function hide() {
    modal?.hide()
  }

  const handleUpload = () => {
    if (isUploading) {
      return
    }
    onUpload?.()
    hide()
  }

  const handleSharePoint = async () => {
    if (loading) {
      return
    }
    loading = true
    try {
      await onSharePoint?.()
      hide()
    } finally {
      loading = false
    }
  }
</script>

<Modal bind:this={modal}>
  <ModalContent
    showConfirmButton={false}
    showCancelButton={false}
    showCloseIcon={false}
    showDivider={false}
    custom
  >
    <div class="content">
      <div class="title">
        <Body size="S">Add knowledge to agent</Body>
      </div>

      <ActionButton
        quiet
        icon="paperclip"
        fullWidth
        disabled={loading || isUploading}
        on:click={handleUpload}
      >
        {isUploading ? "Uploading..." : "Add files"}
        <span class="file-limit-note">(max {MAX_FILE_SIZE_LABEL} per file)</span
        >
      </ActionButton>
      {#if $featureFlags[FeatureFlag.AI_RAG_SHAREPOINT]}
        <ActionButton
          quiet
          icon={MicrosoftSharepointLogo}
          fullWidth
          disabled={loading}
          on:click={handleSharePoint}
        >
          {loading ? "Loading SharePoint..." : "Add from SharePoint"}
        </ActionButton>
      {/if}
    </div>
  </ModalContent>
</Modal>

<style>
  .content {
    width: 300px;
    padding: var(--spacing-s);
  }
  .title {
    padding: var(--spacing-s);
  }

  .file-limit-note {
    color: var(--spectrum-global-color-gray-600);
  }
</style>
