<script lang="ts">
  import { Icon } from "@budibase/bbui"
  import { appsStore } from "@/stores/portal"
  import { sdk } from "@budibase/shared-core"
  import { type EnrichedUser, type ParsedInvite } from "@/types"

  export let row: EnrichedUser | ParsedInvite
  $: priviliged = sdk.users.isAdminOrBuilder(row)
  $: count = getCount(row)

  const getCount = (row: EnrichedUser | ParsedInvite) => {
    const appList = priviliged ? $appsStore.apps : row.apps
    return appList?.length || 0
  }
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
