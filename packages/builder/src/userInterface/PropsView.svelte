<script>

import {
    keys,
    map,
} from "lodash/fp";
import {
    pipe
} from "../common/core";

export let propsDefinition;
export let props;

let fields = pipe(propsDefinition,[
    keys,
    map(k => propsDefinition[k])
]);

</script>



<style>
    
</style>