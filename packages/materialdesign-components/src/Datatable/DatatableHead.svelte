<script>

export let _bb

let thead

$: thead && _bb.attachChildren(thead)

</script>

<thead bind:this={thead} class=className></thead>