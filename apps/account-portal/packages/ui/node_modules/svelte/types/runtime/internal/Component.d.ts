import { noop } from './utils';
import { T$$ } from './types';
export declare function bind(component: any, name: any, callback: any): void;
export declare function create_component(block: any): void;
export declare function claim_component(block: any, parent_nodes: any): void;
export declare function mount_component(component: any, target: any, anchor: any, customElement: any): void;
export declare function destroy_component(component: any, detaching: any): void;
export declare function init(component: any, options: any, instance: any, create_fragment: any, not_equal: any, props: any, append_styles: any, dirty?: number[]): void;
export declare let SvelteElement: any;
/**
 * Base class for Svelte components. Used when dev=false.
 */
export declare class SvelteComponent {
    $$: T$$;
    $$set?: ($$props: any) => void;
    $destroy(): void;
    $on(type: any, callback: any): typeof noop;
    $set($$props: any): void;
}
