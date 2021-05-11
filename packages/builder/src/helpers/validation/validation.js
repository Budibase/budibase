import { writable, derived } from 'svelte/store'

export function createValidationStore(initialValue, ...validators) {
	let touched = false
	
	const value = writable(initialValue || '') 
	const error = derived(value, $v => {
		if (touched) {
			return validate($v, validators)
		} else {
			touched = true
		}
	})
	
	return [value, error]
}

function validate(value, validators) {
    const failing = validators.find(v => v(value) !== true)

    return failing && failing(value)
}