<script>
  import mustache from "mustache"

  export let tagline
  export let inputs

  // Add bolt tags around inputs
  $: boldTagline = tagline.replace(/{{/g, "<b>{{").replace(/}}/, "}}</b>")

  // Fill in inputs with mustache
  $: parsedTagline = mustache.render(boldTagline, { inputs })

  // Wrap bound fields inside spans to highlight them
  $: html = (parsedTagline || "")
    .replace(/{{\s/g, "<span>")
    .replace(/\s}}/g, "</span>")
</script>

<div>
  {@html html}
</div>

<style>
  div :global(span) {
    font-size: 0.9em;
    background-color: var(--purple-light);
    padding: var(--spacing-xs);
    border-radius: var(--border-radius-m);
  }
</style>
