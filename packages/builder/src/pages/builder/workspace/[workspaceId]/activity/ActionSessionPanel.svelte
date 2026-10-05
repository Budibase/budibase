<script lang="ts">
  import type { ActionSession } from "@budibase/types"
  import ActivityDetailsList from "./ActivityDetailsList.svelte"
  import ActivityPanelShell from "./ActivityPanelShell.svelte"
  import {
    getActionSessionDetails,
    getActionSessionTitle,
  } from "./actionSessionRows"

  let {
    session,
    onClose,
  }: {
    session: ActionSession | undefined
    onClose: () => void
  } = $props()
</script>

<ActivityPanelShell
  open={!!session}
  title={session ? getActionSessionTitle(session) : ""}
  {onClose}
>
  {#if session}
    <section class="activity-panel-section">
      <div class="section-title">Details</div>

      <ActivityDetailsList details={getActionSessionDetails(session)} />
    </section>
  {/if}
</ActivityPanelShell>
