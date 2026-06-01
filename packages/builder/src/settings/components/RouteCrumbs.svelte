<script lang="ts">
  import { Breadcrumbs, Breadcrumb } from "@/components/portal/page"
  import { bb } from "@/stores/bb"
  import type { MatchedRoute } from "@/types/routing"

  export let matched: MatchedRoute | undefined
  export let locked: string | undefined
  export let resolveTitle: (
    _title: string | ((_path: string | undefined) => string) | undefined,
    _path: string | undefined
  ) => string | undefined
  export let resolvePathParams: (
    _path: string | undefined,
    _params: Record<string, string>
  ) => string | undefined

  $: route = matched?.entry
  $: params = matched?.params || {}
</script>

<Breadcrumbs>
  {#if !route?.crumbs?.length}
    <Breadcrumb text={route?.section} />
  {:else}
    {#each route?.crumbs || [] as crumb, idx}
      {@const isLast = idx == (route?.crumbs?.length || 0) - 1}
      {@const crumbPath = resolvePathParams(crumb.path, params)}
      {#if isLast}
        <Breadcrumb>
          <div class="last-crumb-content">
            {resolveTitle(crumb.title, crumbPath)}
          </div>
        </Breadcrumb>
      {:else}
        <Breadcrumb
          text={resolveTitle(crumb.title, crumbPath)}
          {...!locked && {
            onClick: () => bb.settings(crumbPath),
          }}
        />
      {/if}
    {/each}
  {/if}
</Breadcrumbs>
