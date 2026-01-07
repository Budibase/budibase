<script lang="ts">
  import {
    Body,
    Icon,
    Popover,
    PopoverAlignment,
    Modal,
    ModalContent,
  } from "@budibase/bbui"
  import {
    deploymentStore,
    automationStore,
    workspaceAppStore,
    appStore,
  } from "@/stores/builder"
  import { type Plugin } from "@budibase/types"
  import type { PopoverAPI } from "@budibase/bbui"

  let actionMenu: any
  let publishPopoverAnchor: HTMLElement | undefined
  let publishSuccessPopover: PopoverAPI | undefined
  let pluginWarningModal: Modal | undefined

  const CURRENT_SVELTE_MAJOR = 5
  const LEGACY_SVELTE_MAJOR = 4

  const getPluginSvelteMajor = (plugin: Plugin): number | undefined => {
    const major = plugin?.schema?.metadata?.svelteMajor
    return typeof major === "number" ? major : undefined
  }

  const getEffectivePluginSvelteMajor = (plugin: Plugin): number => {
    return getPluginSvelteMajor(plugin) ?? LEGACY_SVELTE_MAJOR
  }

  $: incompatiblePlugins = ($appStore.usedPlugins || []).filter(plugin => {
    const major = getPluginSvelteMajor(plugin)
    // `schema.metadata.svelteMajor` only exists on Svelte 5 plugins - treat
    // absence as legacy (Svelte 4).
    return major !== CURRENT_SVELTE_MAJOR
  })

  const hasAcknowledgedSvelte4PluginWarning = (appId?: string) => {
    const key = `bb:publish:svelte4-plugin-warning-ack:${appId}`
    if (!key || typeof window === "undefined") {
      return false
    }
    try {
      return window.localStorage.getItem(key) === "1"
    } catch (err) {
      return false
    }
  }

  const acknowledgeSvelte4PluginWarning = (appId?: string) => {
    const key = `bb:publish:svelte4-plugin-warning-ack:${appId}`
    if (!key || typeof window === "undefined") {
      return
    }
    try {
      window.localStorage.setItem(key, "1")
    } catch (err) {
      // Ignore storage failures (e.g. privacy mode)
    }
  }

  let hasAcknowledgedWarning = hasAcknowledgedSvelte4PluginWarning(
    $appStore.appId
  )

  $: hasAcknowledgedWarning = hasAcknowledgedSvelte4PluginWarning(
    $appStore.appId
  )

  const showPluginWarningModal = () => {
    actionMenu?.hide?.()
    pluginWarningModal?.show()
  }

  const publish = async () => {
    if (incompatiblePlugins.length && !hasAcknowledgedWarning) {
      showPluginWarningModal()
      return
    }
    actionMenu?.hide?.()
    await publishWithoutChecks()
  }

  const publishWithoutChecks = async () => {
    if ($deploymentStore.isPublishing) {
      return
    }
    await deploymentStore.publishApp()
    publishSuccessPopover?.show()
  }

  const publishAnyway = async () => {
    acknowledgeSvelte4PluginWarning($appStore.appId)
    hasAcknowledgedWarning = true
    actionMenu?.hide?.()
    pluginWarningModal?.hide()
    await publishWithoutChecks()
  }
</script>

<div
  class="publish-menu"
  class:disabled={$deploymentStore.isPublishing}
  role="button"
  tabindex="0"
  bind:this={publishPopoverAnchor}
  on:click={publish}
  on:keydown={e => e.key === "Enter" && publish()}
>
  <Icon size="M" name="arrow-circle-up" />
  <span>Publish</span>
</div>

<Popover
  anchor={publishPopoverAnchor}
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
      {#if $automationStore.automations.length}
        Automations published: {$automationStore.automations.length}
        <br />
      {/if}
      {#if $workspaceAppStore.workspaceApps.length}
        Apps published: {$workspaceAppStore.workspaceApps.length}
      {/if}
    </Body>
  </div>
</Popover>

<Modal bind:this={pluginWarningModal}>
  <ModalContent
    title="Svelte 4 plugins detected"
    confirmText="Publish anyway"
    cancelText="Cancel"
    warning
    disabled={$deploymentStore.isPublishing}
    onConfirm={publishAnyway}
  >
    <Body size="S">
      Some plugins in this workspace were built for Svelte 4 and may not work
      correctly until they are updated to Svelte 5.
    </Body>

    {#if incompatiblePlugins.length}
      <div class="plugin-warning-list">
        <ul>
          {#each incompatiblePlugins as plugin (plugin._id || plugin.name)}
            <li>
              <span class="plugin-name">{plugin.name}</span>
              {#if plugin.version}
                <span class="plugin-version">v{plugin.version}</span>
              {/if}
              <span class="plugin-svelte-major">
                Svelte {getEffectivePluginSvelteMajor(plugin)}
              </span>
            </li>
          {/each}
        </ul>
      </div>
    {/if}
  </ModalContent>
</Modal>

<style>
  .publish-menu {
    font-size: var(--font-size-l);
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
    background: var(--spectrum-global-color-gray-800);
    border-radius: 8px;
    color: var(--spectrum-global-color-gray-50);
    cursor: pointer;
    padding: var(--spacing-s) var(--spacing-l);
    transition: background-color 130ms ease-in-out;
  }
  .publish-menu.disabled {
    background: var(--spectrum-global-color-gray-400);
    color: var(--spectrum-global-color-gray-600);
    cursor: default;
    opacity: 0.8;
  }
  .publish-menu span {
    display: flex;
    gap: var(--spacing-s);
    align-items: center;
    font-size: var(--font-size-m);
  }
  .publish-menu:hover,
  .publish-menu:focus-visible {
    background-color: var(--spectrum-global-color-gray-700);
  }
  .publish-menu.disabled:hover,
  .publish-menu.disabled:focus-visible {
    background-color: var(--spectrum-global-color-gray-400);
  }
  .popover-content {
    display: flex;
    gap: var(--spacing-s);
    padding: var(--spacing-m);
  }
  .plugin-warning-list {
    margin-top: var(--spacing-m);
    background: var(--spectrum-global-color-gray-100);
    border: 1px solid var(--spectrum-global-color-gray-200);
    border-radius: 8px;
    padding: var(--spacing-m);
  }
  .plugin-warning-list ul {
    margin: 0;
    padding-left: var(--spacing-m);
  }
  .plugin-warning-list li {
    display: flex;
    gap: var(--spacing-s);
    align-items: center;
    margin: var(--spacing-s) 0;
  }
  .plugin-name {
    font-weight: 600;
    color: var(--spectrum-global-color-gray-900);
  }
  .plugin-version {
    font-size: var(--font-size-s);
    color: var(--spectrum-global-color-gray-700);
  }
  .plugin-svelte-major {
    font-size: var(--font-size-s);
    color: var(--spectrum-global-color-gray-700);
  }
</style>
