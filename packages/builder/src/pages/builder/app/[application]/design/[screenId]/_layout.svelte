<script lang="ts">
  import AppPanel from "./_components/AppPanel.svelte"
  import * as routify from "@roxi/routify"
  import { syncURLToState } from "@/helpers/urlStateSync"
  import {
    screenStore,
    selectedScreen,
    appStore,
    deploymentStore,
  } from "@/stores/builder"
  import { onDestroy } from "svelte"
  import LeftPanel from "./_components/LeftPanel.svelte"
  import TopBar from "@/components/common/TopBar.svelte"
  import {
    Body,
    Button,
    Icon,
    Popover,
    PopoverAlignment,
    type PopoverAPI,
  } from "@budibase/bbui"

  let publishButton: HTMLElement | undefined
  let publishSuccessPopover: PopoverAPI | undefined

  // Keep URL and state in sync for selected screen ID
  const stopSyncing = syncURLToState({
    urlParam: "screenId",
    stateKey: "selectedScreenId",
    validate: (id: string) =>
      $screenStore.screens.some(screen => screen._id === id),
    fallbackUrl: "../../design",
    routify,
    update: screenStore.select,
    store: screenStore,
  })

  const publish = async () => {
    await deploymentStore.publishApp(false)
    publishSuccessPopover?.show()
  }

  onDestroy(() => {
    stopSyncing?.()
  })
</script>

{#if $selectedScreen}
  <div class="design">
    <TopBar
      breadcrumbs={[{ text: "Apps" }, { text: $appStore.name }]}
      icon="RailLeft"
    >
      <Button
        cta
        on:click={publish}
        disabled={$deploymentStore.isPublishing}
        bind:ref={publishButton}
        slot="right"
      >
        Publish
      </Button>
    </TopBar>
    <div class="content">
      <LeftPanel />
      <AppPanel />
      <slot />
    </div>
  </div>

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
{/if}

<style>
  .design {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    height: 0;
  }
  .content {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: stretch;
    flex: 1 1 auto;
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
