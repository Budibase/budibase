<script>
  import { Icon } from "@budibase/bbui"
  import { apps } from "stores/portal"
  import { sdk } from "@budibase/shared-core"

  export let value
  export let row

  $: priviliged = sdk.users.isAdminOrBuilder(row)
  $: count = priviliged ? $apps.length : value?.length || 0
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
