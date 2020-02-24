<script>

export let _bb

const cb =  _bb.getContext("BBMD:data-table:cb")

let thead

$: thead && _bb.attachChildren(thead)

</script>

<thead bind:this={thead} class=className></thead>