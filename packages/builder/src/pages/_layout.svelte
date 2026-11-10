<script lang="ts">
  import { isActive } from "@roxi/routify"
  import PortalLayout from "@/components/portal/PortalLayout.svelte"

  let isPortalPage = $derived($isActive("/apps") || $isActive("/requests"))
</script>

{#if isPortalPage}
  <PortalLayout>
    <slot />
  </PortalLayout>
{:else}
  <slot />
{/if}
