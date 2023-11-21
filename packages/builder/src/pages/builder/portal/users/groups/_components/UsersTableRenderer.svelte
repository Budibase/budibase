<script>
  import { Icon } from "@budibase/bbui"

  export let value
</script>

<div class="align">
  <div class="spacing">
    <Icon name="User" />
  </div>
  {parseInt(value?.length) || 0}
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
