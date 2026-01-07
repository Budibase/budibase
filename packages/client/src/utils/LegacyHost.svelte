<svelte:options runes={false} />

<script lang="ts">
  import { onMount, onDestroy, getAllContexts } from "svelte"

  // Svelte 3/4 class constructor
  export let ctor: new (_opts: {
    target: Element
    props?: Record<string, any>
    context?: Map<any, any>
    $$slots?: Record<string, any>
    $$scope?: any
  }) => { $set?: (_p: any) => void; $destroy?: () => void }

  let container: HTMLElement
  let instance: any

  let _scope: any
  // eslint-disable-next-line no-undef
  $: _scope = (globalThis as any).$$scope

  let _slots: any
  $: _slots = $$slots
  $: if (instance) {
    const { ctor: _omit, ...rest } = $$props
    instance.$set?.(rest)
  }

  $: instance?.$set?.({ $$scope: _scope })
  $: instance?.$set?.({ $$slots: _slots })
  onMount(() => {
    let ctx: Map<any, any> | undefined
    try {
      const all = getAllContexts?.()
      ctx = all instanceof Map ? all : new Map(all ?? [])
    } catch {
      console.error("Error getting all contexts")
    }

    const { ctor: _omit, ...rest } = $$props

    const target =
      container?.nodeType === Node.ELEMENT_NODE ? container : undefined

    instance = new ctor({
      target: target ?? container,
      props: rest,
      $$slots: _slots,
      $$scope: _scope,
      context: ctx,
    })

    return () => instance?.$destroy?.()
  })

  onDestroy(() => instance?.$destroy?.())
</script>

<!-- Just a mount point; do not render a <slot> here -->
<div bind:this={container}></div>
