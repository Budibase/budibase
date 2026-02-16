<script lang="ts">
  import {
    BUDIBASE_AI_PROVIDER_ID,
    type AIConfigResponse,
  } from "@budibase/types"
  import { ActionButton, Modal, Body, ProgressCircle } from "@budibase/bbui"
  import CustomConfigModal from "./AIConfigModal.svelte"
  import BBAIConfigModal from "./BBAIConfigModal.svelte"
  import { onMount } from "svelte"
  import { admin, licensing } from "@/stores/portal"
  import { API } from "@/api"
  import PortalModal from "./PortalModal.svelte"

  export let row: AIConfigResponse

  $: isEdit = !!row._id

  let configModal: { show: () => void; hide: () => void }
  let openModal: boolean
  let hasLicenseKey: boolean | null = null

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
      hasLicenseKey = false
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
    {:else if hasLicenseKey == null}
      <div class="license-check">
        <ProgressCircle />
        <Body size="S">Checking license...</Body>
      </div>
    {:else if hasLicenseKey === false}
      <PortalModal
        confirmHandler={() => {
          window.open($admin.accountPortalUrl, "_blank", "noopener,noreferrer")
          openModal = false
        }}
        cancelHandler={() => {
          openModal = false
        }}
      />
    {:else}
      <BBAIConfigModal
        config={row._id ? row : undefined}
        type={row.configType}
      />
    {/if}
  </Modal>
{/if}

<style>
  .license-check {
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
    padding: var(--spacing-m);
  }
</style>
