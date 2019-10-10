<script>
import cssVars from "./cssVars";
import {buildStyle} from "./buildStyle";
export let className = "default";
export let disabled = false;
export let contentText;
export let contentComponent;
export let onClick;
export let background;
export let color;
export let border;
export let padding;
export let hoverColor;
export let hoverBackground;
export let hoverBorder;

export let _bb;
let contentComponentContainer;
let cssVariables;
let buttonStyles;

let customHoverColorClass;
let customHoverBorderClass;
let customHoverBackClass;

$:{
	if(_bb && contentComponentContainer && contentComponent._component)
		_bb.initialiseComponent(contentComponent, contentComponentContainer);

	cssVariables = {
		hoverColor, hoverBorder,
		hoverBackground
	};

	buttonStyles = buildStyle({
		background, color, border, padding
	})

	customHoverColorClass = hoverColor ? "customHoverColor" : "";
	customHoverBorderClass = hoverBorder ? "customHoverBorder" : "";
	customHoverBackClass = hoverBackground ? "customHoverBack" : "";
}




const clickHandler = () => {
	_bb.call(onClick);
}

</script>


<button use:cssVars={cssVariables} 
		class="{className} {customHoverColorClass} {customHoverBorderClass} {customHoverBackClass}" 
		disabled={disabled || false} 
		on:click={clickHandler} 
		style={buttonStyles}>
    {#if contentComponent && contentComponent._component}
	<div bind:this={contentComponentContainer}>
	</div>
    {:else if contentText}
    {contentText}
    {:else}
    <slot />
    {/if}
</button>


<style>

.default {
	font-family: inherit;
	font-size: inherit;
	padding: 0.4em;
	margin: 0 0 0.5em 0;
	box-sizing: border-box;
	border: 1px solid #ccc;
	border-radius: 2px;
	color: #333;
	background-color: #f4f4f4;
	outline: none;
}

.default:active {
	background-color: #ddd;
}

.default:focus {
	border-color: #666;
}

.customHoverBorder:hover {
	border: var(--hoverBorder);
}

.customHoverColor:hover {
	color: var(--hoverColor);
}

.customHoverBack:hover {
	background: var(--hoverBackground);
}
</style>