/**
 * Exposes Svelte modules globally for plugin compatibility.
 *
 * Plugins are built with Svelte externalized, expecting these modules
 * to be available on the window object at runtime.
 */

// Svelte 5 modules
import * as svelte from "svelte"
import * as svelteStore from "svelte/store"
// @ts-ignore - no types for internal
import * as svelteInternal from "svelte/internal/client"
import * as svelteTransition from "svelte/transition"
import * as svelteAnimate from "svelte/animate"
import * as svelteMotion from "svelte/motion"
import * as svelteEasing from "svelte/easing"

// Svelte 4 (legacy) modules for backward compatibility
import * as svelteLegacy from "svelte-legacy"
// @ts-ignore - no types for legacy modules
import * as svelteLegacyStore from "svelte-legacy/store"
// @ts-ignore
import * as svelteLegacyInternal from "svelte-legacy/internal"
// @ts-ignore
import * as svelteLegacyTransition from "svelte-legacy/transition"
// @ts-ignore
import * as svelteLegacyAnimate from "svelte-legacy/animate"
// @ts-ignore
import * as svelteLegacyMotion from "svelte-legacy/motion"
// @ts-ignore
import * as svelteLegacyEasing from "svelte-legacy/easing"

// Extend Window interface for all Svelte globals
declare global {
  interface Window {
    // Svelte 5 globals (camelCase)
    svelte: typeof svelte
    svelteStore: typeof svelteStore
    svelteInternal: typeof svelteInternal
    svelteTransition: typeof svelteTransition
    svelteAnimate: typeof svelteAnimate
    svelteMotion: typeof svelteMotion
    svelteEasing: typeof svelteEasing

    // Svelte 4 legacy globals (camelCase)
    svelteLegacy: typeof svelteLegacy
    svelteLegacyStore: typeof svelteLegacyStore
    svelteLegacyInternal: typeof svelteLegacyInternal
    svelteLegacyTransition: typeof svelteLegacyTransition
    svelteLegacyAnimate: typeof svelteLegacyAnimate
    svelteLegacyMotion: typeof svelteLegacyMotion
    svelteLegacyEasing: typeof svelteLegacyEasing

    // Svelte 4 legacy globals (snake_case - hardcoded by Svelte 4 bundles)
    svelte_internal: typeof svelteLegacyInternal
    svelte_store: typeof svelteLegacyStore
    svelte_transition: typeof svelteLegacyTransition
    svelte_animate: typeof svelteLegacyAnimate
    svelte_motion: typeof svelteLegacyMotion
    svelte_easing: typeof svelteLegacyEasing
  }
}

// Svelte 5 globals
window.svelte = svelte
window.svelteStore = svelteStore
window.svelteInternal = svelteInternal
window.svelteTransition = svelteTransition
window.svelteAnimate = svelteAnimate
window.svelteMotion = svelteMotion
window.svelteEasing = svelteEasing

// Svelte 4 legacy globals (camelCase)
window.svelteLegacy = svelteLegacy
window.svelteLegacyStore = svelteLegacyStore
window.svelteLegacyInternal = svelteLegacyInternal
window.svelteLegacyTransition = svelteLegacyTransition
window.svelteLegacyAnimate = svelteLegacyAnimate
window.svelteLegacyMotion = svelteLegacyMotion
window.svelteLegacyEasing = svelteLegacyEasing

// Svelte 4 legacy globals (snake_case - for bundles that hardcode these names)
window.svelte_internal = svelteLegacyInternal
window.svelte_store = svelteLegacyStore
window.svelte_transition = svelteLegacyTransition
window.svelte_animate = svelteLegacyAnimate
window.svelte_motion = svelteLegacyMotion
window.svelte_easing = svelteLegacyEasing
