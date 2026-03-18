<script lang="ts">
  import { Divider, Layout, StatusLight } from "@budibase/bbui"
  import { Breadcrumbs, Breadcrumb } from "@/components/portal/page"
  import { bb } from "@/stores/bb"
  import NewPill from "@/components/common/NewPill.svelte"

  $: matched = $bb.settings.route
  $: route = matched?.entry
  $: params = matched?.params || {}

  $: handleSectionClick = () => {
    if (route?.crumbs?.length) {
      const firstCrumb = route.crumbs[0]
      if (firstCrumb?.path) {
        bb.settings(firstCrumb.path)
      }
    }
  }

  const resolvePathParams = (
    path: string | undefined,
    params: Record<string, string>
  ) => {
    if (!path) {
      return path
    }
    return path.replace(/:([^/]+)/g, (_match, key) => params[key] ?? `:${key}`)
  }

  const resolveTitle = (
    title: string | ((_path: string | undefined) => string) | undefined,
    path: string | undefined
  ) => {
    if (typeof title === "function") {
      return title(path)
    }
    return title
  }
</script>

<div class="route-header">
  {#if route?.nav?.length}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="section-header" on:click={handleSectionClick}>
      {route?.section || ""}
    </div>
    <Divider noMargin size={"S"} />
    <div class="page-heading">
      <div class="nav">
        {#each route?.nav as nav}
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <!-- svelte-ignore a11y-no-static-element-interactions -->
          <div
            class="nav-tab"
            class:match={nav.path === route.path}
            class:error={nav.error?.()}
            on:click={() => bb.settings(nav.path)}
          >
            {resolveTitle(nav.title, nav.path)}
            {#if nav.error?.()}
              <span class="indicator">
                <StatusLight
                  color={"var(--spectrum-global-color-static-red-600)"}
                  size="M"
                />
              </span>
            {:else if nav.new}
              <NewPill />
            {/if}
          </div>
        {/each}
      </div>
      <!-- Registered on the page itself -->
      <div class="page-actions"></div>
    </div>
  {:else}
    <Layout paddingX="L" paddingY="L">
      <div class="page-heading">
        <div class="crumbs">
          <!-- Drill down -->
          <Breadcrumbs>
            {#if !route?.crumbs?.length}
              <Breadcrumb text={route?.section} />
            {:else}
              {#each route?.crumbs || [] as crumb, idx}
                {@const isLast = idx == (route?.crumbs?.length || 0) - 1}
                {@const crumbPath = resolvePathParams(crumb.path, params)}
                <Breadcrumb
                  text={resolveTitle(crumb.title, crumbPath)}
                  {...!isLast && { onClick: () => bb.settings(crumbPath) }}
                />
              {/each}
            {/if}
          </Breadcrumbs>
        </div>
        <!-- Registered on the page itself -->
        <div class="page-actions no-padding"></div>
      </div>
    </Layout>
  {/if}
  <Divider size={"S"} noMargin />
</div>

<style>
  .route-header .section-header,
  .route-header .page-heading .nav,
  .route-header :global(.container) {
    padding-left: calc(var(--spacing-xl) * 2);
  }
  .route-header .section-header,
  .route-header .page-heading .page-actions,
  .route-header :global(.container) {
    padding-right: calc(var(--spacing-xl) * 2);
  }

  .route-header :global(hr) {
    background-color: var(--spectrum-global-color-gray-300);
  }
  .route-header {
    display: flex;
    flex-direction: column;
  }
  .section-header {
    font-size: 16px;
    font-weight: 600;
    padding: var(--spacing-l);
  }
  .nav-tab {
    position: relative;
    display: flex;
    cursor: pointer;
    align-items: center;
    gap: var(--spacing-s);
    font-weight: 500;
    color: var(--spectrum-global-color-gray-700);
    font-size: 14px;
  }

  .nav-tab.error .indicator {
    position: absolute;
    right: -12px;
    top: -5px;
  }

  .nav-tab:hover {
    color: var(--spectrum-global-color-gray-900);
    cursor: default;
  }
  .match {
    color: var(--spectrum-global-color-gray-900);
  }
  .nav {
    display: flex;
    gap: var(--spacing-l);
    padding: var(--spacing-l);
    flex: 1;
  }
  .page-heading,
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .page-actions {
    padding-right: var(--spacing-l);
  }
  .route-header .page-heading .page-actions.no-padding {
    padding-right: 0px;
  }
  .crumbs {
    flex: 1;
  }
  .section-header,
  .page-heading {
    min-height: 32px;
  }
  .page-heading .crumbs :global(.crumb) {
    color: var(--spectrum-global-color-gray-800);
  }
</style>
