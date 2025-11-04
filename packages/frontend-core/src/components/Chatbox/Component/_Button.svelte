<script lang="ts">
  import { Button } from "@budibase/bbui"

  export let text: string
  export let onClick: ((_e: Event) => void) | string

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
  }
</script>

<Button on:click={handleClick}>
  {text}
</Button>
