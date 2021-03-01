import { fade, blur, slide, fly } from 'svelte/transition'

// Default options
const transitions = new Map([
  ["fade", { tn: fade, opt: {} }],
  ["blur", { tn: blur, opt: {} }],
  ["slide", { tn: slide, opt: {} }],
  ["fly", { tn: fly, opt: { y: 30 } }],
])
	
export default function transition(node, {type, options = {}}) {
	const { tn, opt } = transitions.get(type) || {}
	return tn ? tn(node, {...opt, ...options}) : fade(node, { duration: 0})
}