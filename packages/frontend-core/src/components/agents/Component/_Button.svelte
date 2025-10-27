<script lang="ts">
  import { Button } from "@budibase/bbui"
  import type { ComponentPayload } from "@budibase/types"

  export let data: ComponentPayload

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

  const handleClick = (event: Event) => {
    if (typeof onClick === "function") {
      onClick(event)
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

    try {
      window.dispatchEvent(
        new CustomEvent("budibase-agent-interaction", {
          detail: {
            type: "button",
            payload: {
              label: slotContent,
              props: rawProps,
              component: data,
            },
          },
        })
      )
    } catch (error) {
      console.warn("Failed to dispatch agent interaction event", error)
    }
  }
</script>

<Button {...buttonProps} on:click={e => handleClick(e)}>
  {slotContent}
</Button>
