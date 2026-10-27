<script lang="ts">
  import {
    BUDIBASE_AI_PROVIDER_ID,
    FeatureFlag,
    type AIConfigResponse,
  } from "@budibase/types"
  import { ActionButton, Modal, Body, ProgressCircle } from "@budibase/bbui"
  import { onMount } from "svelte"
  import { admin, featureFlags } from "@/stores/portal"
  import PortalModal from "../PortalModal.svelte"
  import { bb } from "@/stores/bb"
  import { aiLicenseStatus } from "../licenseStatus"

  interface Props {
    row: AIConfigResponse
  }

  let { row }: Props = $props()

  let isEdit = $derived(!!row._id)
  let isBBAI = $derived(row.provider === BUDIBASE_AI_PROVIDER_ID)
  let isCreationDisabled = $derived(
    $admin.cloud &&
      $featureFlags[FeatureFlag.DISABLE_CUSTOM_AI_CONFIG_CREATION] &&
      !isEdit &&
      !isBBAI
  )
  let licenseStatus = $derived($aiLicenseStatus)

  let enableBBAIModal = $state<Modal | null>()
  let pendingOpen = $state(false)

  function openConfig() {
    bb.settings(`/connections/${row.configType}/${row._id || "new"}`, {
      provider: row.provider,
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
    if (pendingOpen && licenseStatus === "has_key") {
      pendingOpen = false
      enableBBAIModal?.hide()
      openConfig()
    }
  })
</script>

{#if !isCreationDisabled}
  <ActionButton size="S" on:click={onClick}
    >{isEdit ? "Edit" : "Connect"}</ActionButton
  >
{/if}

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
