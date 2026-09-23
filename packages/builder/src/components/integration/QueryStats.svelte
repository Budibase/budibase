<script lang="ts">
  import { Label } from "@budibase/bbui"

  interface Props {
    info?: { code: number; time: string; size: string }
  }

  let { info = undefined }: Props = $props()

  const success = $derived(!!info && info.code >= 200 && info.code < 400)
</script>

{#if info}
  <div class="stats">
    <Label size="L">
      Status: <span class={success ? "green" : "red"}>{info.code}</span>
    </Label>
    <Label size="L">
      Time: <span class={success ? "green" : "red"}>{info.time}</span>
    </Label>
    <Label size="L">
      Size: <span class={success ? "green" : "red"}>{info.size}</span>
    </Label>
  </div>
{/if}

<style>
  .stats {
    display: flex;
    gap: var(--spacing-m);
  }
  .green {
    color: var(--spectrum-global-color-green-600);
  }
  .red {
    color: var(--spectrum-global-color-red-600);
  }
</style>
