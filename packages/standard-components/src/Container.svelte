<script>
  import { getContext } from "svelte"

  const { styleable } = getContext("sdk")
  const component = getContext("component")

  export let className = ""
  export let type = "div"
</script>

{#if type === 'div'}
  <div use:styleable={$component.styles}>
    <slot />
  </div>
{:else if type === 'header'}
  <header use:styleable={$component.styles}>
    <slot />
  </header>
{:else if type === 'main'}
  <main use:styleable={$component.styles}>
    <slot />
  </main>
{:else if type === 'footer'}
  <footer use:styleable={$component.styles}>
    <slot />
  </footer>
{:else if type === 'aside'}
  <aside use:styleable={$component.styles}>
    <slot />
  </aside>
{:else if type === 'summary'}
  <summary use:styleable={$component.styles}>
    <slot />
  </summary>
{:else if type === 'details'}
  <details use:styleable={$component.styles}>
    <slot />
  </details>
{:else if type === 'article'}
  <article use:styleable={$component.styles}>
    <slot />
  </article>
{:else if type === 'nav'}
  <nav use:styleable={$component.styles}>
    <slot />
  </nav>
{:else if type === 'mark'}
  <mark use:styleable={$component.styles}>
    <slot />
  </mark>
{:else if type === 'figure'}
  <figure use:styleable={$component.styles}>
    <slot />
  </figure>
{:else if type === 'figcaption'}
  <figcaption use:styleable={$component.styles}>
    <slot />
  </figcaption>
{:else if type === 'paragraph'}
  <p use:styleable={$component.styles}>
    <slot />
  </p>
{/if}
