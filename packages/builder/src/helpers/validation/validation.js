import { writable, derived } from 'svelte/store'

export function createValidationStore(initialValue, ...validators) {
	
	const value = writable(initialValue || '') 
	const error = derived(value, $v => validate($v, validators))
	
	return [value, error]
}

function validate(value, validators) {
    const failing = validators.find(v => v(value) !== true)

    return failing && failing(value)
}