<script>
  import { Button, ActionButton, StatusLight } from "@budibase/bbui"
  import {
    builderStore,
    isOnlyUser,
    appStore,
    deploymentStore,
  } from "@/stores/builder"
  import VersionModal from "@/components/deploy/VersionModal.svelte"

  let versionModal
  let showNpsSurvey = false

  $: updateAvailable =
    $appStore.upgradableVersion &&
    $appStore.version &&
    $appStore.upgradableVersion !== $appStore.version
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="action-top-nav">
  <div class="action-buttons">
    {#if updateAvailable && $isOnlyUser}
      <div class="app-action-button version" on:click={versionModal.show}>
        <div class="app-action">
          <ActionButton quiet>
            <StatusLight notice />
            Update
          </ActionButton>
        </div>
      </div>
    {/if}
    <div class="app-action-button users">
      <div class="app-action" id="builder-app-users-button">
        <ActionButton
          quiet
          icon="UserGroup"
          on:click={() => {
            builderStore.showBuilderSidePanel()
          }}
        >
          Users
        </ActionButton>
      </div>
    </div>
    <div class="app-action-button publish">
      <div class="app-action" id="builder-app-users-button">
        <Button
          cta
          on:click={deploymentStore.publishApp}
          disabled={$deploymentStore.isPublishing}>Publish</Button
        >
      </div>
    </div>
  </div>
</div>

{#if showNpsSurvey}
  <div class="nps-survey" />
{/if}

<VersionModal hideIcon bind:this={versionModal} />

<style>
  .action-buttons {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    height: 100%;
  }
  .action-top-nav {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    height: 100%;
  }
  .app-action-button {
    height: 100%;
    display: flex;
    align-items: center;
    padding-right: var(--spacing-m);
  }
  .app-action-button.version :global(.spectrum-ActionButton-label) {
    display: flex;
    gap: var(--spectrum-actionbutton-icon-gap);
  }
  .app-action {
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
  }
</style>
