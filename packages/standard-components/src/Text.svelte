<script>
  import { getContext } from "svelte"

  const { styleable } = getContext("sdk")
  const component = getContext("component")

  export let text = ""
  export let className = ""
  export let type = ""

  const isTag = tag => type === tag
</script>

{#if isTag('none')}
  <span use:styleable={$component.styles}>{text}</span>
{:else if isTag('bold')}
  <b class={className} use:styleable={$component.styles}>{text}</b>
{:else if isTag('strong')}
  <strong class={className} use:styleable={$component.styles}>{text}</strong>
{:else if isTag('italic')}
  <i class={className} use:styleable={$component.styles}>{text}</i>
{:else if isTag('emphasis')}
  <em class={className} use:styleable={$component.styles}>{text}</em>
{:else if isTag('mark')}
  <mark class={className} use:styleable={$component.styles}>{text}</mark>
{:else if isTag('small')}
  <small class={className} use:styleable={$component.styles}>{text}</small>
{:else if isTag('del')}
  <del class={className} use:styleable={$component.styles}>{text}</del>
{:else if isTag('ins')}
  <ins class={className} use:styleable={$component.styles}>{text}</ins>
{:else if isTag('sub')}
  <sub class={className} use:styleable={$component.styles}>{text}</sub>
{:else if isTag('sup')}
  <sup class={className} use:styleable={$component.styles}>{text}</sup>
{:else}<span use:styleable={$component.styles}>{text}</span>{/if}

<style>
  span {
    display: inline-block;
  }
</style>
