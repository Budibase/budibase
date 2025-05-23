<script>
  import {
    Button,
    ActionButton,
    StatusLight,
    Popover,
    PopoverAlignment,
    Body,
    Icon,
  } from "@budibase/bbui"
  import {
    builderStore,
    isOnlyUser,
    appStore,
    deploymentStore,
  } from "@/stores/builder"
  import { admin } from "@/stores/portal"
  import VersionModal from "@/components/deploy/VersionModal.svelte"

  let versionModal
  let showNpsSurvey = false
  let publishButton
  let publishSuccessPopover

  $: updateAvailable =
    $appStore.upgradableVersion &&
    $appStore.version &&
    $appStore.upgradableVersion !== $appStore.version

  const publish = async () => {
    await deploymentStore.publishApp(false)
    publishSuccessPopover?.show()
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="action-top-nav">
  <div class="action-buttons">
    {#if updateAvailable && $isOnlyUser && !$admin.isDev}
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
      <Button
        cta
        on:click={publish}
        disabled={$deploymentStore.isPublishing}
        bind:ref={publishButton}
      >
        Publish
      </Button>
    </div>
  </div>
</div>

{#if showNpsSurvey}
  <div class="nps-survey" />
{/if}

<VersionModal hideIcon bind:this={versionModal} />

<Popover
  anchor={publishButton}
  bind:this={publishSuccessPopover}
  align={PopoverAlignment.Right}
  offset={6}
>
  <div class="popover-content">
    <Icon
      name="CheckmarkCircle"
      color="var(--spectrum-global-color-green-400)"
      size="L"
    />
    <Body size="S">
      App published successfully
      <br />
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <div class="link" on:click={deploymentStore.viewPublishedApp}>
        View app
      </div>
    </Body>
  </div>
</Popover>

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
    padding-right: var(--spacing-s);
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
  .popover-content {
    display: flex;
    gap: var(--spacing-m);
    padding: var(--spacing-xl);
  }
  .link {
    text-decoration: underline;
    color: var(--spectrum-global-color-gray-900);
  }
  .link:hover {
    cursor: pointer;
    filter: brightness(110%);
  }
</style>
