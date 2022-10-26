<script>
  import { Icon } from "@budibase/bbui"

  export let value
</script>

<div class="align">
  <div class="spacing">
    <Icon name="UserGroup" />
  </div>
  <div class="opacity">
    {value?.length || 0}
  </div>
</div>

<style>
  .align {
    display: flex;
    overflow: hidden;
  }
  .opacity {
    opacity: 0.8;
  }
  .spacing {
    margin-right: var(--spacing-m);
  }
</style>
