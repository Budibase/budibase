<script>
  import { buildStyle } from "./buildStyle"

  export let text = ""
  export let className = ""

  export let type = ""

  export let _bb

  const isTag = tag => type === tag
</script>

{#if isTag('none')}
  <span>{text}</span>
{:else if isTag('bold')}
  <b class={className}>{text}</b>
{:else if isTag('strong')}
  <strong class={className}>{text}</strong>
{:else if isTag('italic')}
  <i class={className}>{text}</i>
{:else if isTag('emphasis')}
  <em class={className}>{text}</em>
{:else if isTag('mark')}
  <mark class={className}>{text}</mark>
{:else if isTag('small')}
  <small class={className}>{text}</small>
{:else if isTag('del')}
  <del class={className}>{text}</del>
{:else if isTag('ins')}
  <ins class={className}>{text}</ins>
{:else if isTag('sub')}
  <sub class={className}>{text}</sub>
{:else if isTag('sup')}
  <sup class={className}>{text}</sup>
{:else}
  <span>{text}</span>
{/if}
