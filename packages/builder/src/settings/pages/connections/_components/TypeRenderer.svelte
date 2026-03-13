<script lang="ts">
  import { Tags, Tag } from "@budibase/bbui"
  import type { UIWorkspaceConnection } from "@/types"

  export let row: UIWorkspaceConnection

  const authTypeLabels: Record<string, string> = {
    basic: "HTTP: Basic",
    bearer: "HTTP: Bearer",
    oauth2: "OAuth2",
    apiKey: "API Key",
  }

  $: authConfigs = row.auth || []
  $: uniqueTypes = [...new Set(authConfigs.map(config => config.type))]

  // Legacy OAuth2 connections don't have auth array - they ARE the OAuth2 config
  $: isLegacyOAuth2 = row.source === "oauth2"

  $: authTags = isLegacyOAuth2
    ? [{ label: authTypeLabels.oauth2 }]
    : uniqueTypes.map(type => ({
        label: authTypeLabels[type] || type,
      }))
</script>

<Tags>
  {#if authTags.length > 0}
    {#each authTags as tag}
      <Tag>{tag.label}</Tag>
    {/each}
  {:else}
    <Tag>No auth</Tag>
  {/if}
</Tags>
