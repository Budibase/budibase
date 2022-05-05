<script>
  import {
    Button,
    ButtonGroup,
    ModalContent,
    Modal,
    notifications,
  } from "@budibase/bbui"
  import { auth, apps } from "stores/portal"
  import { processStringSync } from "@budibase/string-templates"
  import { API } from "api"

  export let app

  let APP_DEV_LOCK_SECONDS = 600
  let appLockModal

  $: lockedBy = app?.lockedBy
  $: lockedByYou = $auth.user.email === lockedBy?.email
  $: lockIdentifer = `${
    Object.prototype.hasOwnProperty.call(lockedBy, "firstName")
      ? lockedBy?.firstName
      : lockedBy?.email
  }`
  $: lockedByHeading =
    lockedBy && lockedByYou ? "Locked by you" : `Locked by ${lockIdentifer}`

  $: lockExpiry = getExpiryDuration(app)

  const getExpiryDuration = app => {
    if (!app.lockedBy) {
      return -1
    }
    let expiry =
      new Date(app.lockedBy.lockedAt).getTime() + APP_DEV_LOCK_SECONDS * 1000
    return expiry - new Date().getTime()
  }

  const releaseLock = async () => {
    if (app) {
      try {
        await API.releaseAppLock(app.devId)
        await apps.load()
        notifications.success("Lock released successfully")
      } catch (err) {
        notifications.error("Error releasing lock")
      }
    } else {
      notifications.error("No application is selected")
    }
  }
</script>

<div class="lock-status">
  {#if lockedBy}
    <Button
      quiet
      secondary
      icon="LockClosed"
      on:click={() => {
        appLockModal.show()
      }}
    >
      <span class="lock-status-text">
        {lockedByHeading}
      </span>
    </Button>
  {/if}
</div>

<Modal bind:this={appLockModal}>
  <ModalContent
    title={lockedByHeading}
    dataCy={"app-lock-modal"}
    showConfirmButton={false}
    showCancelButton={false}
  >
    <p>
      Apps are locked to prevent work from being lost from overlapping changes
      between your team.
    </p>

    {#if lockedByYou && lockExpiry > 0}
      {processStringSync(
        "This lock will expire in {{ duration time 'millisecond' }} from now",
        {
          time: lockExpiry,
        }
      )}
    {/if}
    <div class="lock-modal-actions">
      <ButtonGroup>
        <Button
          secondary
          quiet={lockedBy && lockedByYou}
          on:click={() => {
            appLockModal.hide()
          }}
        >
          <span class="cancel"
            >{lockedBy && !lockedByYou ? "Done" : "Cancel"}</span
          >
        </Button>
        {#if lockedByYou && lockExpiry > 0}
          <Button
            secondary
            on:click={() => {
              releaseLock()
              appLockModal.hide()
            }}
          >
            <span class="unlock">Release Lock</span>
          </Button>
        {/if}
      </ButtonGroup>
    </div>
  </ModalContent>
</Modal>

<style>
  .lock-modal-actions {
    display: flex;
    justify-content: flex-end;
    margin-top: var(--spacing-l);
    gap: var(--spacing-xl);
  }
  .lock-status {
    display: flex;
    gap: var(--spacing-s);
  }
  /* .lock-status :global(.spectrum-Button-label) {
    font-weight: 200;
    font-family: var(--font-sans);
  } */
</style>
