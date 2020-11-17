<script>
  import { styleable } from "@budibase/component-sdk"

  export let text = ""
  export let className = ""
  export let type = ""
  export let styles

  const isTag = tag => type === tag
</script>

{#if isTag('none')}
  <span use:styleable={styles}>{text}</span>
{:else if isTag('bold')}
  <b class={className} use:styleable={styles}>{text}</b>
{:else if isTag('strong')}
  <strong class={className} use:styleable={styles}>{text}</strong>
{:else if isTag('italic')}
  <i class={className} use:styleable={styles}>{text}</i>
{:else if isTag('emphasis')}
  <em class={className} use:styleable={styles}>{text}</em>
{:else if isTag('mark')}
  <mark class={className} use:styleable={styles}>{text}</mark>
{:else if isTag('small')}
  <small class={className} use:styleable={styles}>{text}</small>
{:else if isTag('del')}
  <del class={className} use:styleable={styles}>{text}</del>
{:else if isTag('ins')}
  <ins class={className} use:styleable={styles}>{text}</ins>
{:else if isTag('sub')}
  <sub class={className} use:styleable={styles}>{text}</sub>
{:else if isTag('sup')}
  <sup class={className} use:styleable={styles}>{text}</sup>
{:else}<span use:styleable={styles}>{text}</span>{/if}

<style>
  span {
    display: inline-block;
  }
</style>
