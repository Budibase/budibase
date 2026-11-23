<script lang="ts">
  import { Updating } from "@budibase/frontend-core"
  import { redirect, params } from "@roxi/routify"
  import { get } from "svelte/store"

  import { API } from "@/api"
  import {
    getWorkspaceIdFromUrl,
    getWorkspaceUrlId,
    redirectLegacyWorkspaceUrl,
  } from "@/helpers/workspaceUrls"
  import { workspaceStore } from "@/stores/builder"

  export let workspaceId: string

  $: workspaceUrlId = getWorkspaceUrlId(workspaceId)
  $: internalWorkspaceId = getWorkspaceIdFromUrl(workspaceId)
  $: isLegacyWorkspaceUrl = workspaceUrlId !== workspaceId

  $: if (isLegacyWorkspaceUrl) {
    redirectLegacyWorkspaceUrl(workspaceId)
  }

  // Set appId immediately so API calls have the correct context
  // Only update if it's different to avoid unnecessary re-renders
  $: if (
    !isLegacyWorkspaceUrl &&
    get(workspaceStore).appId !== internalWorkspaceId
  ) {
    workspaceStore.update(state => ({
      ...state,
      appId: internalWorkspaceId,
    }))
  }

  $params
  $redirect

  async function isMigrationDone() {
    const response = await API.getMigrationStatus()
    return response.migrated
  }

  async function onMigrationDone() {
    // For some reason routify params is not stripping the ? properly, so we need to check both with and without ?
    const returnUrl = $params.returnUrl || $params["?returnUrl"]
    $redirect(returnUrl)
  }
</script>

{#if !isLegacyWorkspaceUrl}
  <Updating {isMigrationDone} {onMigrationDone} />
{/if}
