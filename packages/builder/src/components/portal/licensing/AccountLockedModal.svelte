<script lang="ts">
  import {
    Modal,
    ModalContent,
    Body,
    Button,
    Detail,
    Link,
  } from "@budibase/bbui"
  import { LockReason } from "@budibase/types"
  import ExportAppModal from "@/components/start/ExportAppModal.svelte"

  const ONE_DAY_MS = 86400000
  const SELF_HOST_DOCS_URL =
    "https://docs.budibase.com/docs/hosting-methods#self-host-budibase"

  let modal: Modal
  let exportModal: Modal

  export let lockedBy: LockReason | undefined
  export let deactivationScheduledAt: string | undefined = undefined
  export let onConfirm: () => void
  export let isOwner = true
  export let appId: string | undefined = undefined

  export function show() {
    modal.show()
  }

  export function hide() {
    modal.hide()
  }

  function handleExport() {
    exportModal.show()
  }

  $: isGracePeriodLock =
    lockedBy === LockReason.FREE_TIER ||
    lockedBy === LockReason.MIGRATION ||
    lockedBy === LockReason.PAID_TO_FREE

  $: modalTitle =
    lockedBy === LockReason.FREE_TIER
      ? "Your trial has ended"
      : "Your tenant is currently de-activated"

  $: scheduledDate = deactivationScheduledAt
    ? new Date(deactivationScheduledAt)
    : null

  $: showRemovalNotice =
    scheduledDate != null && !Number.isNaN(scheduledDate.getTime())

  $: formattedDeactivationDate = showRemovalNotice
    ? new Intl.DateTimeFormat("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(scheduledDate!)
    : ""

  $: daysRemaining = showRemovalNotice
    ? Math.max(
        0,
        Math.ceil((scheduledDate!.getTime() - Date.now()) / ONE_DAY_MS)
      )
    : 0

  $: removalNoticeMessage = showRemovalNotice
    ? `Your data will be removed on ${formattedDeactivationDate} (${daysRemaining} day${daysRemaining === 1 ? "" : "s"} remaining).`
    : ""
</script>

<Modal bind:this={modal}>
  {#if isGracePeriodLock}
    <ModalContent
      title={modalTitle}
      size="S"
      showCancelButton={false}
      showConfirmButton={false}
      showCloseIcon={true}
    >
      <div class="locked-modal-content">
        <Body size="S">
          {#if lockedBy === LockReason.MIGRATION}
            You’re currently on the Budibase Free plan, which is no longer
            available for cloud users. Your tenant has been temporarily locked.
            Upgrade to keep building in the cloud, export your workspaces, or
            move to self-hosted Budibase before your data is removed.
          {:else if lockedBy === LockReason.PAID_TO_FREE}
            Your paid Budibase subscription has expired and was not renewed.
            Your tenant is now in a locked, limited-access state. Upgrade to
            keep building in the cloud, export your workspaces, or move to
            self-hosted Budibase before your data is removed.
          {:else}
            Your Budibase Cloud trial has ended and your tenant is temporarily
            locked. Upgrade to keep building in the cloud, export your
            workspaces, or move to self-hosted Budibase before your data is
            removed.
          {/if}
        </Body>

        {#if showRemovalNotice}
          <div class="removal-notice">
            <Detail size="S" weight={600}>Data scheduled for removal</Detail>
            <Body size="S">{removalNoticeMessage}</Body>
          </div>

          <Detail size="S" weight={600}>
            You can still export your workspaces during this period.
          </Detail>
        {/if}
      </div>

      <div class="locked-modal-actions" slot="footer">
        <Button cta on:click={onConfirm}>
          {isOwner ? "Upgrade plan" : "View plans"}
        </Button>
        <Button secondary on:click={handleExport}>Export workspace</Button>
        <Link
          href={SELF_HOST_DOCS_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          Self-host Budibase
        </Link>
      </div>
    </ModalContent>
  {:else}
    <ModalContent
      title="Your tenant is currently de-activated"
      size="S"
      showCancelButton={false}
      showCloseIcon={true}
      confirmText="View plans"
      {onConfirm}
    >
      <Body size="S">
        Due to the Free plan user limit being exceeded, your tenant has been
        de-activated. Upgrade your plan to re-activate your tenant.
      </Body>
    </ModalContent>
  {/if}
</Modal>

{#if appId}
  <Modal bind:this={exportModal}>
    <ExportAppModal {appId} published={false} />
  </Modal>
{/if}

<style>
  .locked-modal-content {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-l);
  }

  .removal-notice {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-s);
    padding: var(--spacing-m);
    border: 1px solid var(--spectrum-global-color-gray-300);
    border-radius: 8px;
    background: var(--spectrum-global-color-gray-75);
  }

  .removal-notice :global(.spectrum-Detail) {
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--spectrum-global-color-gray-700);
  }

  .locked-modal-content :global(.spectrum-Detail) {
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--spectrum-global-color-gray-700);
  }

  .locked-modal-actions {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: var(--spacing-m);
    width: 100%;
  }

  .locked-modal-actions :global(.spectrum-Button) {
    width: 100%;
    margin: 0;
  }

  .locked-modal-actions :global(a) {
    align-self: center;
    margin-top: var(--spacing-xs);
  }
</style>
