<script lang="ts">
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

  $: authLabels = isLegacyOAuth2
    ? [authTypeLabels.oauth2]
    : uniqueTypes.map(type => authTypeLabels[type] || type)
  $: authLabelText = authLabels.length > 0 ? authLabels.join(", ") : "No auth"
</script>

<div class="connection-auth-labels">
  {authLabelText}
</div>

<style>
  .connection-auth-labels {
    margin-inline-start: auto;
    width: max-content;
    max-width: 100%;
    color: var(--spectrum-global-color-gray-700);
  }
</style>
