<script lang="ts">
  import { functionsEnabled } from "@/stores/builder/functions"
</script>

<!--
  Renders its children only when Functions are available (feature flag present,
  not Cloud, server-confirmed). Purely a usability gate - the server enforces
  access independently.
-->
{#if $functionsEnabled}
  <slot />
{/if}
