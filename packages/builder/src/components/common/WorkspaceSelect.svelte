<script lang="ts">
  import { Icon, ActionMenu, MenuItem } from "@budibase/bbui"
  import { appStore } from "@/stores/builder"
  import { enrichedApps, auth, licensing } from "@/stores/portal"
  import { goto } from "@roxi/routify"
  import { createEventDispatcher } from "svelte"
  import { sdk } from "@budibase/shared-core"

  export const hide = () => {
    if (workspaceMenu) {
      workspaceMenu.hide()
    }
  }

  const dispatch = createEventDispatcher()

  let workspaceMenu: ActionMenu | undefined
  let menuOpen = false

  $: apps = $enrichedApps
  $: appId = $appStore.appId

  const getAppUrl = (app: any) => {
    return app.editable ? `/builder/workspace/${app.devId}` : `/app${app.url}`
  }
</script>

<ActionMenu
  bind:this={workspaceMenu}
  disabled={false}
  roundedPopover
  on:open={() => (menuOpen = true)}
  on:close={() => (menuOpen = false)}
>
  <svelte:fragment slot="control">
    <div class="workspace-menu" class:disabled={false}>
      <div
        role="button"
        tabindex="0"
        class="workspace-menu-text"
        title={$appStore.name}
      >
        <span>{$appStore.name}</span>
        <Icon size="M" name={!menuOpen ? "caret-down" : "caret-up"} />
      </div>
    </div>
  </svelte:fragment>

  <div class="menu-item-header">
    <div>Workspaces</div>
    {#if $auth.user && sdk.users.canCreateApps($auth.user) && !$licensing.isFreePlan}
      <Icon
        hoverable
        on:click={() => {
          dispatch("create")
          workspaceMenu?.hide()
        }}
      />
    {/if}
  </div>

  <div class="app-items">
    {#each apps as app}
      {@const selected = appId === app.devId}
      <span class="menu-item" class:selected title={app.name}>
        <MenuItem
          icon={selected ? "check" : undefined}
          on:click={() => {
            const appUrl = getAppUrl(app)
            if (!app.editable) {
              window.open(appUrl, "_blank")
              return
            }
            if (selected) return
            $goto(appUrl)
          }}
          on:auxclick={() => {
            window.open(getAppUrl(app), "_blank")
          }}
        >
          {app.name}
        </MenuItem>
      </span>
    {/each}
  </div>
</ActionMenu>

<style>
  .app-items {
    max-height: 500px;
    min-width: 200px;
    overflow: auto;
  }
  /* Shift the icon to the right */
  .menu-item.selected :global(.spectrum-Menu-item .icon) {
    order: 2;
    margin-left: var(--spacing-s);
    margin-right: unset;
  }

  .menu-item :global(.spectrum-Menu-item) {
    max-width: 300px;
  }

  .menu-item :global(.spectrum-Menu-itemLabel) {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .workspace-menu {
    font-size: var(--font-size-l);
    display: flex;
    align-items: center;
    background: var(--spectrum-global-color-gray-200);
    border-radius: 8px;
    justify-content: space-between;
    cursor: pointer;
    transition: background-color 130ms ease-in-out;
  }
  .workspace-menu.disabled {
    background: var(--spectrum-global-color-gray-400);
    color: var(--spectrum-global-color-gray-600);
    cursor: default;
    opacity: 0.8;
  }
  .workspace-menu-text {
    padding: var(--spacing-s) var(--spacing-m);
    display: flex;
    gap: var(--spacing-s);
    align-items: center;
    font-size: var(--font-size-m);
    flex: 1 1 0;
    min-width: 0;
    overflow: hidden;
    box-sizing: border-box;
    justify-content: space-between;
  }
  .workspace-menu-text span {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .workspace-menu-text:hover {
    border-radius: 8px 0 0 8px;
  }
  .workspace-menu.disabled .workspace-menu-text:hover {
    border-radius: 0;
  }
  .menu-item-header {
    display: flex;
    justify-content: space-between;
    padding: var(--spectrum-listitem-padding-y)
      var(--spectrum-listitem-padding-right) var(--spectrum-listitem-padding-y)
      var(--spectrum-listitem-padding-left);
  }
  .menu-item-header div {
    color: var(--spectrum-global-color-gray-700);
  }
</style>
