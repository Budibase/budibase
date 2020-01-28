<script>

export let _children = [];
export let className="";
export let onLoad;
export let _bb;

let rootDiv;
$:{
	if(_bb && rootDiv && _children && _children.length)
		_bb.hydrateChildren(_children, rootDiv);
}


</script>

<div class="{className}" bind:this={rootDiv}>
</div>
