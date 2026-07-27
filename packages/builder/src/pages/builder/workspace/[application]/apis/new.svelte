<script lang="ts">
  import { bb } from "@/stores/bb"
  import NoResults from "../_components/NoResults.svelte"
</script>

<NoResults
  ctaText="Create your first connection"
  onCtaClick={() => bb.settings("/connections/apis/create")}
  resourceType="api"
>
  No connections yet! Build your first connection to get started.
</NoResults>

<style>
</style>
