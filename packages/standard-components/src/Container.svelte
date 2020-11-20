<script>
  import { getContext } from "svelte"

  const { styleable } = getContext("sdk")
  const styles = getContext("style")

  export let className = ""
  export let type = "div"
</script>

{#if type === 'div'}
  <div use:styleable={styles}>
    <slot />
  </div>
{:else if type === 'header'}
  <header use:styleable={styles}>
    <slot />
  </header>
{:else if type === 'main'}
  <main use:styleable={styles}>
    <slot />
  </main>
{:else if type === 'footer'}
  <footer use:styleable={styles}>
    <slot />
  </footer>
{:else if type === 'aside'}
  <aside use:styleable={styles}>
    <slot />
  </aside>
{:else if type === 'summary'}
  <summary use:styleable={styles}>
    <slot />
  </summary>
{:else if type === 'details'}
  <details use:styleable={styles}>
    <slot />
  </details>
{:else if type === 'article'}
  <article use:styleable={styles}>
    <slot />
  </article>
{:else if type === 'nav'}
  <nav use:styleable={styles}>
    <slot />
  </nav>
{:else if type === 'mark'}
  <mark use:styleable={styles}>
    <slot />
  </mark>
{:else if type === 'figure'}
  <figure use:styleable={styles}>
    <slot />
  </figure>
{:else if type === 'figcaption'}
  <figcaption use:styleable={styles}>
    <slot />
  </figcaption>
{:else if type === 'paragraph'}
  <p use:styleable={styles}>
    <slot />
  </p>
{/if}
