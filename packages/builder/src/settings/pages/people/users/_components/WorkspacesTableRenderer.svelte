<svelte:options runes={true} />

<script lang="ts">
  import { Icon } from "@budibase/bbui"
  import { workspacesStore } from "@/stores/portal/workspaces"
  import { sdk } from "@budibase/shared-core"
  import { type EnrichedUser, type ParsedInvite } from "@/types"

  interface Props {
    row: EnrichedUser | ParsedInvite
  }

  let { row }: Props = $props()
  const priviliged = $derived(sdk.users.isAdminOrBuilder(row))

  const getCount = (row: EnrichedUser | ParsedInvite) => {
    const appList = priviliged ? $workspacesStore.apps : row.apps
    return appList?.length || 0
  }
  const count = $derived(getCount(row))
</script>

<div class="align">
  <div class="spacing">
    <Icon name="browser" />
  </div>
  {count}
</div>

<style>
  .align {
    display: flex;
    overflow: hidden;
  }
  .spacing {
    margin-right: var(--spacing-m);
  }
</style>
