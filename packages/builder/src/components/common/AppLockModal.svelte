<script>
  import {
    Button,
    ButtonGroup,
    ModalContent,
    Modal,
    notifications,
    ProgressCircle,
    Layout,
    Body,
    Icon,
  } from "@budibase/bbui"
  import { auth, apps } from "stores/portal"
  import { processStringSync } from "@budibase/string-templates"
  import { API } from "api"

  export let app
  export let buttonSize = "M"

  let APP_DEV_LOCK_SECONDS = 600 //common area for this?
  let appLockModal
  let processing = false

  $: lockedBy = app?.lockedBy
  $: lockedByYou = $auth.user.email === lockedBy?.email

  $: lockIdentifer = `${
    lockedBy && lockedBy.firstName ? lockedBy?.firstName : lockedBy?.email
  }`

  $: lockedByHeading =
    lockedBy && lockedByYou ? "Locked by you" : `Locked by ${lockIdentifer}`

  const getExpiryDuration = app => {
    if (!app?.lockedBy?.lockedAt) {
      return -1
    }
    let expiry =
      new Date(app.lockedBy.lockedAt).getTime() + APP_DEV_LOCK_SECONDS * 1000
    return expiry - new Date().getTime()
  }

  const releaseLock = async () => {
    processing = true
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
    processing = false
  }
</script>

{#if lockedBy}
  <div class="lock-status">
    <Icon
      name="LockClosed"
      hoverable
      size={buttonSize}
      on:click={e => {
        e.stopPropagation()
        appLockModal.show()
      }}
    />
  </div>
{/if}

<Modal bind:this={appLockModal}>
  <ModalContent
    title={lockedByHeading}
    showConfirmButton={false}
    showCancelButton={false}
  >
    <Layout noPadding>
      <Body size="S">
        Apps are locked to prevent work being lost from overlapping changes
        between your team.
      </Body>
      {#if lockedByYou && getExpiryDuration(app) > 0}
        <span class="lock-expiry-body">
          {processStringSync(
            "This lock will expire in {{ duration time 'millisecond' }} from now.",
            {
              time: getExpiryDuration(app),
            }
          )}
        </span>
      {/if}
      <div class="lock-modal-actions">
        <ButtonGroup>
          <Button
            secondary
            quiet={lockedBy && lockedByYou}
            disabled={processing}
            on:click={() => {
              appLockModal.hide()
            }}
          >
            <span class="cancel"
              >{lockedBy && !lockedByYou ? "Done" : "Cancel"}</span
            >
          </Button>
          {#if lockedByYou}
            <Button
              cta
              disabled={processing}
              on:click={() => {
                releaseLock()
                appLockModal.hide()
              }}
            >
              {#if processing}
                <ProgressCircle overBackground={true} size="S" />
              {:else}
                <span class="unlock">Release Lock</span>
              {/if}
            </Button>
          {/if}
        </ButtonGroup>
      </div>
    </Layout>
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
    max-width: 175px;
  }
</style>
