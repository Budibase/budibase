<script lang="ts">
  import { PublishResourceState } from "@budibase/types"

  export let status: PublishResourceState
</script>

<div
  class="status"
  class:published={status === PublishResourceState.PUBLISHED}
  class:draft={[
    PublishResourceState.UNPUBLISHED,
    PublishResourceState.DISABLED,
  ].includes(status)}
>
  {status}
</div>

<style>
  .status {
    padding: 2px 6px 2px 18px;
    border-radius: 8px;
    width: max-content;
    color: white;
    position: relative;
    text-transform: capitalize;
    background: var(--color);

    &.published {
      --color: #004c2e;
      border: 1px solid #005d39;
    }

    &.draft {
      --color: var(--spectrum-global-color-gray-300);
      border: 1px solid var(--spectrum-global-color-gray-400);
    }

    &::after {
      content: " ";
      display: block;
      width: 8px;
      height: 8px;
      background: var(--color);
      filter: brightness(3);
      border-radius: 50%;
      position: absolute;
      left: 6px;
      top: 50%;
      transform: translateY(-50%);
    }
  }
</style>
