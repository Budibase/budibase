<script lang="ts">
  import { Breadcrumbs, Breadcrumb } from "@/components/portal/page"
  import { bb } from "@/stores/bb"
  import type { MatchedRoute } from "@/types/routing"

  export let stack: MatchedRoute[]
  export let currentRoute: MatchedRoute | undefined
  export let resolveTitle: (
    title: string | ((path: string | undefined) => string) | undefined,
    path: string | undefined
  ) => string | undefined
  export let resolvePathParams: (
    path: string | undefined,
    params: Record<string, string>
  ) => string | undefined
</script>

<Breadcrumbs>
  {#each stack as stackEntry}
    {@const stackPath = resolvePathParams(
      stackEntry.entry.path,
      stackEntry.params || {}
    )}
    {@const stackLastCrumb = stackEntry.entry.crumbs?.at(-1)}
    <Breadcrumb
      text={resolveTitle(
        stackLastCrumb?.title,
        resolvePathParams(stackLastCrumb?.path, stackEntry.params || {})
      )}
      onClick={() => bb.settings(stackPath)}
    />
  {/each}
  {#key currentRoute?.entry?.path}
    <Breadcrumb>
      <div class="last-crumb-content">
        {#if currentRoute}
          {@const lastCrumb = currentRoute.entry.crumbs?.at(-1)}
          {resolveTitle(
            lastCrumb?.title,
            resolvePathParams(lastCrumb?.path, currentRoute.params || {})
          )}
        {/if}
      </div>
    </Breadcrumb>
  {/key}
</Breadcrumbs>
