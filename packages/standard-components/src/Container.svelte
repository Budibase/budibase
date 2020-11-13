<script>
  export let className = ""
  export let type = "div"

  $: console.log(type)
</script>

{#if type === 'div'}
  <div>
    <slot />
  </div>
{:else if type === 'header'}
  <header>
    <slot />
  </header>
{:else if type === 'main'}
  <main>
    <slot />
  </main>
{:else if type === 'footer'}
  <footer>
    <slot />
  </footer>
{:else if type === 'aside'}
  <aside>
    <slot />
  </aside>
{:else if type === 'summary'}
  <summary>
    <slot />
  </summary>
{:else if type === 'details'}
  <details>
    <slot />
  </details>
{:else if type === 'article'}
  <article>
    <slot />
  </article>
{:else if type === 'nav'}
  <nav>
    <slot />
  </nav>
{:else if type === 'mark'}
  <mark><slot /></mark>
{:else if type === 'figure'}
  <figure>
    <slot />
  </figure>
{:else if type === 'figcaption'}
  <figcaption>
    <slot />
  </figcaption>
{:else if type === 'paragraph'}
  <p>
    <slot />
  </p>
{/if}
