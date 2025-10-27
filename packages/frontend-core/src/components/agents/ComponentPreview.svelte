<script lang="ts">
  import { Button } from "@budibase/bbui"
  import type { ComponentPreviewPayload } from "@budibase/types"

  export let data: ComponentPreviewPayload

  const allowedButtonProps = new Set([
    "type",
    "disabled",
    "size",
    "cta",
    "primary",
    "secondary",
    "warning",
    "overBackground",
    "quiet",
    "icon",
    "active",
    "tooltip",
    "newStyles",
    "id",
    "ref",
    "reverse",
  ])

  const rawProps = data.props ?? {}
  const { onClick, ...restProps } = rawProps as Record<string, unknown> & {
    onClick?: unknown
  }

  const buttonProps =
    data.name === "Button"
      ? Object.fromEntries(
          Object.entries(restProps).filter(([key]) =>
            allowedButtonProps.has(key)
          )
        )
      : {}

  const slotContent =
    data.slot ??
    (typeof (rawProps as Record<string, unknown>).label === "string"
      ? ((rawProps as Record<string, unknown>).label as string)
      : "Ask Budibase")

  const handleClick = (event: MouseEvent) => {
    if (typeof onClick === "function") {
      ;(onClick as (event: MouseEvent) => void)(event)
      return
    }

    if (typeof onClick === "string") {
      try {
        const fn = new Function(onClick)
        fn.call(window, event)
      } catch (error) {
        console.error("Failed to execute preview onClick handler", error)
      }
    }
  }
</script>

<div class="component-preview">
  {#if data.name === "Button"}
    <Button {...buttonProps} on:click={handleClick}>
      {slotContent}
    </Button>
  {:else}
    <p class="unsupported">Unsupported component: {data.name}</p>
  {/if}
</div>

<style>
  .component-preview {
    display: inline-flex;
  }

  .unsupported {
    margin: 0;
    font-size: 16px;
  }
</style>
