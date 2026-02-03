<script lang="ts">
  import { marked } from "marked"
  import sanitizeHtml from "sanitize-html"

  export let value: string | undefined = undefined
  export let height: string | undefined = undefined

  let ref: HTMLDivElement | undefined

  $: updateValue(ref, value)

  const sanitizeOptions: sanitizeHtml.IOptions = {
    allowedTags: [
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "p",
      "br",
      "hr",
      "strong",
      "em",
      "b",
      "i",
      "u",
      "s",
      "del",
      "sup",
      "sub",
      "mark",
      "ul",
      "ol",
      "li",
      "a",
      "img",
      "pre",
      "code",
      "blockquote",
      "table",
      "thead",
      "tbody",
      "tfoot",
      "tr",
      "th",
      "td",
      "dl",
      "dt",
      "dd",
      "div",
      "span",
    ],
    allowedAttributes: {
      a: ["href", "title", "target", "rel"],
      img: ["src", "alt", "title", "width", "height"],
      th: ["align", "valign"],
      td: ["align", "valign"],
      code: ["class"],
      pre: ["class"],
      span: ["class"],
      div: ["class"],
    },
    allowedSchemes: ["http", "https", "mailto"],
  }

  const updateValue = async (
    ref: HTMLDivElement | undefined,
    markdown: string | undefined
  ) => {
    if (!ref) {
      return
    }
    if (!markdown) {
      ref.innerHTML = ""
      return
    }
    const rawHtml = marked.parse(markdown, { async: false }) as string
    ref.innerHTML = sanitizeHtml(rawHtml, sanitizeOptions)
  }
</script>

<div class="markdown-viewer" style="height:{height};" bind:this={ref}></div>

<style>
  .markdown-viewer {
    overflow: auto;
  }
  /* Remove margin on the first and last components to fully trim the preview */
  .markdown-viewer :global(:first-child) {
    margin-top: 0;
  }
  .markdown-viewer :global(:last-child) {
    margin-bottom: 0;
  }
  /* Code blocks */
  .markdown-viewer :global(pre) {
    background: var(--spectrum-global-color-gray-200);
    padding: 4px;
    border-radius: 4px;
  }
  .markdown-viewer :global(code) {
    color: #e83e8c;
  }
  .markdown-viewer :global(pre code) {
    color: var(--spectrum-alias-text-color);
  }
  /* Block quotes */
  .markdown-viewer :global(blockquote) {
    border-left: 4px solid var(--spectrum-global-color-gray-400);
    color: var(--spectrum-global-color-gray-700);
    margin-left: 0;
    padding-left: 20px;
  }
  /* HRs */
  .markdown-viewer :global(hr) {
    background-color: var(--spectrum-global-color-gray-300);
    border: none;
    height: 2px;
  }
  /* Tables */
  .markdown-viewer :global(td),
  .markdown-viewer :global(th) {
    border-color: var(--spectrum-alias-border-color) !important;
  }
  /* Links */
  .markdown-viewer :global(a) {
    color: var(--primaryColor);
  }
  .markdown-viewer :global(a:hover) {
    color: var(--primaryColorHover);
  }
</style>
