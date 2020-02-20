<script>

export let className=""
export let _bb

let thead

$: _bb.attachChildren(thead)

</script>

<tbody bind:this={thead} class=className></tbody>