<script>
  import { Icon } from "@budibase/bbui"
  import { appsStore } from "@/stores/portal"
  import { sdk } from "@budibase/shared-core"

  export let row
  $: priviliged = sdk.users.isAdminOrBuilder(row)
  $: count = getCount(row)

  const getCount = () => {
    if (priviliged) {
      return $appsStore.apps.length
    } else {
      return row.apps.length
    }
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
