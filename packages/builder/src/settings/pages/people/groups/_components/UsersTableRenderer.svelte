<script lang="ts">
  import { Icon } from "@budibase/bbui"

  interface Props {
    value?: { readonly length: number } | null
  }

  let { value }: Props = $props()
</script>

<div class="align">
  <div class="spacing">
    <Icon name="user" />
  </div>
  {value?.length || 0}
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
