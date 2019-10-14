<script>

export let children = [];
export let className="";
export let data=[];
export let dataItemComponent;
export let onLoad;

export let _bb;

let rootDiv;
let staticComponentsApplied=false;
let dataBoundComponents = [];
let previousData;
let onLoadCalled = false;

const hasData = () => 
    Array.isArray(data) && data.length > 0;

$: {

    if(children && children.length > 0 && !staticComponentsApplied) {
        for(let child of children) {
            _bb.appendComponent(
                child.control,
                rootDiv);
        }
    }
    

    if(previousData !== data) {

        for(let c of dataBoundComponents) {
            dataBoundComponents[c].$destroy();
        }
        dataBoundComponents = [];


        if(hasData()) {
            let index = 0;
            for(let dataItem of data) {
                _bb.appendComponent(
                    dataItemComponent,
                    rootDiv,
                    dataItem
                );
            }
        }
    }

    if(!onLoadCalled && onLoad && !onLoad.isPlaceholder) {
        _bb.call(onLoad);
        onLoadCalled = true;
    }
}


</script>

<div class="{className}" bind:this={rootDiv}>
</div>

