<script>
  import { getContext } from "svelte"

  const { styleable, transition } = getContext("sdk")
  const component = getContext("component")

  export let type = "div"
</script>

{#if type === 'div'}
  <div  in:transition={{type: $component.transition}} use:styleable={$component.styles}>
    <slot />
  </div>
{:else if type === 'header'}
  <header in:transition={{type: $component.transition}} use:styleable={$component.styles}>
    <slot />
  </header>
{:else if type === 'main'}
  <main in:transition={{type: $component.transition}} use:styleable={$component.styles}>
    <slot />
  </main>
{:else if type === 'footer'}
  <footer in:transition={{type: $component.transition}} use:styleable={$component.styles}>
    <slot />
  </footer>
{:else if type === 'aside'}
  <aside in:transition={{type: $component.transition}} use:styleable={$component.styles}>
    <slot />
  </aside>
{:else if type === 'summary'}
  <summary in:transition={{type: $component.transition}} use:styleable={$component.styles}>
    <slot />
  </summary>
{:else if type === 'details'}
  <details in:transition={{type: $component.transition}} use:styleable={$component.styles}>
    <slot />
  </details>
{:else if type === 'article'}
  <article in:transition={{type: $component.transition}} use:styleable={$component.styles}>
    <slot />
  </article>
{:else if type === 'nav'}
  <nav in:transition={{type: $component.transition}} use:styleable={$component.styles}>
    <slot />
  </nav>
{:else if type === 'mark'}
  <mark in:transition={{type: $component.transition}} use:styleable={$component.styles}>
    <slot />
  </mark>
{:else if type === 'figure'}
  <figure in:transition={{type: $component.transition}} use:styleable={$component.styles}>
    <slot />
  </figure>
{:else if type === 'figcaption'}
  <figcaption in:transition={{type: $component.transition}} use:styleable={$component.styles}>
    <slot />
  </figcaption>
{:else if type === 'paragraph'}
  <p in:transition={{type: $component.transition}} use:styleable={$component.styles}>
    <slot />
  </p>
{/if}
