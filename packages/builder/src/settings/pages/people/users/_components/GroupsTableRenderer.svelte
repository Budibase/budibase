<svelte:options runes={true} />

<script lang="ts">
  import { Icon } from "@budibase/bbui"

  interface Props {
    value?: readonly object[] | null
  }

  let { value }: Props = $props()
</script>

<div class="align">
  <div class="spacing">
    <Icon name="users-three" />
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
