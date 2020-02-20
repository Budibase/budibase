<script>

export let url = ""
export let text = ""
export let openInNewTab = false

export let _bb

let anchorElement

$: anchorElement && !text && _bb.attachChildren(anchorElement)
$: target = openInNewTab ? "_blank" : "_self"

</script>

<a href={url} bind:this={anchorElement} target={target}>{text}</a>


