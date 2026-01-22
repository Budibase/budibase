<script lang="ts">
  import { PublishResourceState } from "@budibase/types"

  export let status: PublishResourceState
  export let loading: boolean = false

  const statusDisplayName: Record<PublishResourceState, string> = {
    [PublishResourceState.PUBLISHED]: "Live",

    [PublishResourceState.DISABLED]: "Draft",
  }
</script>

<span
  class="status"
  class:published={status === PublishResourceState.PUBLISHED}
  class:disabled={status === PublishResourceState.DISABLED}
  class:loading
>
  {statusDisplayName[status]}
</span>

<style>
  .status {
    display: inline;
    font-family: var(--font-sans);
    font-size: 14px;
    line-height: 17px;
    font-weight: 400;
    color: var(--color);

    &.published {
      --color: #8ca171;
    }

    &.disabled {
      --color: var(--spectrum-global-color-gray-700);
    }
  }
  .loading {
    opacity: 0.5;
    pointer-events: none;
  }
</style>
