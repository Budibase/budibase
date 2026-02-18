<script lang="ts">
  import {
    BUDIBASE_AI_PROVIDER_ID,
    type AIConfigResponse,
  } from "@budibase/types"
  import { ActionButton, Modal, Body, ProgressCircle } from "@budibase/bbui"
  import { onMount } from "svelte"
  import { admin, licensing } from "@/stores/portal"
  import { API } from "@/api"
  import PortalModal from "./PortalModal.svelte"
  import { bb } from "@/stores/bb"

  interface Props {
    row: AIConfigResponse
  }

  let { row }: Props = $props()

  let isEdit = $derived(!!row._id)

  let enableBBAIModal = $state<Modal | null>()
  let hasLicenseKey: boolean | null = $state(null)

  function onClick() {
    if (row.provider === BUDIBASE_AI_PROVIDER_ID && !hasLicenseKey) {
      enableBBAIModal?.show()
    } else {
      bb.settings(`/ai-config/configs/${row._id || "new"}`, {
        provider: row.provider,
        type: row.configType,
      })
    }
  }

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

<ActionButton size="S" on:click={onClick}
  >{isEdit ? "Edit" : "Connect"}</ActionButton
>

<Modal bind:this={enableBBAIModal}>
  {#if hasLicenseKey == null}
    <div class="license-check">
      <ProgressCircle />
      <Body size="S">Checking license...</Body>
    </div>
  {:else if hasLicenseKey === false}
    <PortalModal
      confirmHandler={() => {
        window.open($admin.accountPortalUrl, "_blank", "noopener,noreferrer")
      }}
      cancelHandler={() => {}}
    />
  {/if}
</Modal>

<style>
  .license-check {
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
    padding: var(--spacing-m);
  }
</style>
