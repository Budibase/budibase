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
  let isBBAI = $derived(row.provider === BUDIBASE_AI_PROVIDER_ID)

  let enableBBAIModal = $state<Modal | null>()
  let licenseStatus = $state<"checking" | "has_key" | "missing_key">("checking")
  let pendingOpen = $state(false)

  function openConfig() {
    bb.settings(`/ai-config/${row.configType}/${row._id || "new"}`, {
      provider: row.provider,
      type: row.configType,
    })
  }

  function onClick() {
    if (!isBBAI) {
      openConfig()
      return
    }

    if (licenseStatus === "has_key") {
      openConfig()
      return
    }

    pendingOpen = licenseStatus === "checking"
    enableBBAIModal?.show()
  }

  onMount(async () => {
    try {
      const license = $licensing.license
      const isOfflineLicense = () => license && "identifier" in license
      if (isOfflineLicense()) {
        licenseStatus = "has_key"
      } else {
        const licenseKeyResponse = await API.getLicenseKey()
        licenseStatus = licenseKeyResponse?.licenseKey
          ? "has_key"
          : "missing_key"
        if (pendingOpen && licenseStatus === "has_key") {
          pendingOpen = false
          enableBBAIModal?.hide()
          openConfig()
        }
      }
    } catch {
      licenseStatus = "missing_key"
    }
  })
</script>

<ActionButton size="S" on:click={onClick}
  >{isEdit ? "Edit" : "Connect"}</ActionButton
>

<Modal bind:this={enableBBAIModal}>
  {#if licenseStatus === "checking"}
    <div class="license-check">
      <ProgressCircle />
      <Body size="S">Checking license...</Body>
    </div>
  {:else if licenseStatus === "missing_key"}
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
