<script>
  import { Icon } from "@budibase/bbui"
  import { sdk } from "@budibase/shared-core"

  export let value
  export let row
  $: count = getCount(Object.keys(value || {}).length)

  const getCount = () => {
    return sdk.users.hasAppBuilderPermissions(row)
      ? row.builder.apps.length +
          Object.keys(row.roles || {}).filter(appId =>
            row.builder.apps.includes(appId)
          ).length
      : value?.length || 0
  }
</script>

<div class="align">
  <div class="spacing">
    <Icon name="WebPage" />
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
