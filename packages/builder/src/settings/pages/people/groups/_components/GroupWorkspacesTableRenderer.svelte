<script lang="ts">
  import { Icon } from "@budibase/bbui"
  import { sdk } from "@budibase/shared-core"
  import type { UserGroup } from "@budibase/types"

  interface Props {
    value?: Record<string, string> | null
    row: UserGroup
  }

  let { value, row }: Props = $props()

  const getCount = ({
    row,
    value,
  }: {
    row: UserGroup
    value?: Record<string, string> | null
  }) => {
    return sdk.users.hasAppBuilderPermissions(row)
      ? (row.builder?.apps?.length || 0) +
          Object.keys(row.roles || {}).filter(
            workspaceId => !row.builder?.apps?.includes(workspaceId)
          ).length
      : Object.keys(value || {}).length
  }

  const count = $derived(getCount({ row, value }))
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
