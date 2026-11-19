<script lang="ts">
  import { Body } from "@budibase/bbui"
</script>

<aside aria-label="Functions alpha trusted author warning">
  <Body size="S">
    Functions alpha is for trusted authors on self-hosted deployments. Code runs
    inside an automation worker with application credentials and network access.
    An isolate escape could expose credentials, files, and internal services; a
    native crash could stop the worker and its automations. Only grant authoring
    access to people you trust to write JavaScript automations.
  </Body>
</aside>

<style>
  aside {
    margin: var(--spacing-m) var(--spacing-xl);
    padding: var(--spacing-m);
    border: 1px solid var(--spectrum-global-color-orange-400);
    border-radius: var(--radius-m);
  }
</style>
