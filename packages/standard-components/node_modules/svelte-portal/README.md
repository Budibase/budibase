Svelte component for rendering outside the DOM of parent component

Idea borrowed from here: https://github.com/sveltejs/svelte/issues/3088#issuecomment-505785516

# Installation

```sh
npm install --save svelte-portal
```

or

```sh
yarn add svelte-portal
```

# Basic Usage

```html
<script>
  import Portal from 'svelte-portal';

  export let show = true;
</script>

{#if show}
  <Portal target="{document.body}">
    <div class="notification __success">Entity successfully updated!</div>
  </Portal>
{/if}
```
