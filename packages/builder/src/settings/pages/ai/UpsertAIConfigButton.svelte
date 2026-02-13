<script lang="ts">
  import {
    BUDIBASE_AI_PROVIDER_ID,
    type AIConfigResponse,
  } from "@budibase/types"
  import { ActionButton, Modal } from "@budibase/bbui"
  import CustomConfigModal from "./CustomConfigModal.svelte"
  import BBAIConfigModal from "./BBAIConfigModal.svelte"
  import { onMount } from "svelte"
  import { admin, licensing } from "@/stores/portal"
  import { API } from "@/api"
  import PortalModal from "./PortalModal.svelte"

  export let row: AIConfigResponse

  $: isEdit = !!row._id

  let configModal: { show: () => void; hide: () => void }
  let openModal: boolean
  let hasLicenseKey: boolean

  $: configModal?.show()

  onMount(async () => {
    try {
      const license = $licensing.license
      const isOfflineLicense = () => license && "identifier" in license
      if (isOfflineLicense()) {
        hasLicenseKey = true
      } else {
        const licenseKeyResponse = await API.getLicenseKey()
        hasLicenseKey = !!licenseKeyResponse?.licenseKey
      }
    } catch {
      //
    }
  })
</script>

<ActionButton
  size="S"
  on:click={() => {
    openModal = true
  }}>{isEdit ? "Edit" : "Connect"}</ActionButton
>

{#if openModal}
  <Modal
    bind:this={configModal}
    on:hide={() => {
      openModal = false
    }}
  >
    {#if row.provider !== BUDIBASE_AI_PROVIDER_ID}
      <CustomConfigModal
        config={row}
        provider={row.provider}
        type={row.configType}
      />
    {:else if !hasLicenseKey}
      <PortalModal
        confirmHandler={() => {
          window.open($admin.accountPortalUrl, "_blank")
          openModal = false
        }}
        cancelHandler={() => {
          openModal = false
        }}
      />
    {:else}
      <BBAIConfigModal config={row} type={row.configType} />
    {/if}
  </Modal>
{/if}
