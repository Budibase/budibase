import { SvelteComponent } from './Component';
export declare function dispatch_dev<T = any>(type: string, detail?: T): void;
export declare function append_dev(target: Node, node: Node): void;
export declare function append_hydration_dev(target: Node, node: Node): void;
export declare function insert_dev(target: Node, node: Node, anchor?: Node): void;
export declare function insert_hydration_dev(target: Node, node: Node, anchor?: Node): void;
export declare function detach_dev(node: Node): void;
export declare function detach_between_dev(before: Node, after: Node): void;
export declare function detach_before_dev(after: Node): void;
export declare function detach_after_dev(before: Node): void;
export declare function listen_dev(node: Node, event: string, handler: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions | EventListenerOptions, has_prevent_default?: boolean, has_stop_propagation?: boolean): () => void;
export declare function attr_dev(node: Element, attribute: string, value?: string): void;
export declare function prop_dev(node: Element, property: string, value?: any): void;
export declare function dataset_dev(node: HTMLElement, property: string, value?: any): void;
export declare function set_data_dev(text: any, data: any): void;
export declare function validate_each_argument(arg: any): void;
export declare function validate_slots(name: any, slot: any, keys: any): void;
export declare function validate_dynamic_element(tag: unknown): void;
export declare function validate_void_dynamic_element(tag: undefined | string): void;
export declare function construct_svelte_component_dev(component: any, props: any): any;
declare type Props = Record<string, any>;
export interface SvelteComponentDev {
    $set(props?: Props): void;
    $on(event: string, callback: ((event: any) => void) | null | undefined): () => void;
    $destroy(): void;
    [accessor: string]: any;
}
export interface ComponentConstructorOptions<Props extends Record<string, any> = Record<string, any>> {
    target: Element | ShadowRoot;
    anchor?: Element;
    props?: Props;
    context?: Map<any, any>;
    hydrate?: boolean;
    intro?: boolean;
    $$inline?: boolean;
}
/**
 * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
 */
export declare class SvelteComponentDev extends SvelteComponent {
    /**
     * @private
     * For type checking capabilities only.
     * Does not exist at runtime.
     * ### DO NOT USE!
     */
    $$prop_def: Props;
    /**
     * @private
     * For type checking capabilities only.
     * Does not exist at runtime.
     * ### DO NOT USE!
     */
    $$events_def: any;
    /**
     * @private
     * For type checking capabilities only.
     * Does not exist at runtime.
     * ### DO NOT USE!
     */
    $$slot_def: any;
    constructor(options: ComponentConstructorOptions);
    $capture_state(): void;
    $inject_state(): void;
}
export interface SvelteComponentTyped<Props extends Record<string, any> = any, Events extends Record<string, any> = any, Slots extends Record<string, any> = any> {
    $set(props?: Partial<Props>): void;
    $on<K extends Extract<keyof Events, string>>(type: K, callback: ((e: Events[K]) => void) | null | undefined): () => void;
    $destroy(): void;
    [accessor: string]: any;
}
/**
 * Base class to create strongly typed Svelte components.
 * This only exists for typing purposes and should be used in `.d.ts` files.
 *
 * ### Example:
 *
 * You have component library on npm called `component-library`, from which
 * you export a component called `MyComponent`. For Svelte+TypeScript users,
 * you want to provide typings. Therefore you create a `index.d.ts`:
 * ```ts
 * import { SvelteComponentTyped } from "svelte";
 * export class MyComponent extends SvelteComponentTyped<{foo: string}> {}
 * ```
 * Typing this makes it possible for IDEs like VS Code with the Svelte extension
 * to provide intellisense and to use the component like this in a Svelte file
 * with TypeScript:
 * ```svelte
 * <script lang="ts">
 * 	import { MyComponent } from "component-library";
 * </script>
 * <MyComponent foo={'bar'} />
 * ```
 *
 * #### Why not make this part of `SvelteComponent(Dev)`?
 * Because
 * ```ts
 * class ASubclassOfSvelteComponent extends SvelteComponent<{foo: string}> {}
 * const component: typeof SvelteComponent = ASubclassOfSvelteComponent;
 * ```
 * will throw a type error, so we need to separate the more strictly typed class.
 */
export declare class SvelteComponentTyped<Props extends Record<string, any> = any, Events extends Record<string, any> = any, Slots extends Record<string, any> = any> extends SvelteComponentDev {
    /**
     * @private
     * For type checking capabilities only.
     * Does not exist at runtime.
     * ### DO NOT USE!
     */
    $$prop_def: Props;
    /**
     * @private
     * For type checking capabilities only.
     * Does not exist at runtime.
     * ### DO NOT USE!
     */
    $$events_def: Events;
    /**
     * @private
     * For type checking capabilities only.
     * Does not exist at runtime.
     * ### DO NOT USE!
     */
    $$slot_def: Slots;
    constructor(options: ComponentConstructorOptions<Props>);
}
/**
 * Convenience type to get the type of a Svelte component. Useful for example in combination with
 * dynamic components using `<svelte:component>`.
 *
 * Example:
 * ```html
 * <script lang="ts">
 * 	import type { ComponentType, SvelteComponentTyped } from 'svelte';
 * 	import Component1 from './Component1.svelte';
 * 	import Component2 from './Component2.svelte';
 *
 * 	const component: ComponentType = someLogic() ? Component1 : Component2;
 * 	const componentOfCertainSubType: ComponentType<SvelteComponentTyped<{ needsThisProp: string }>> = someLogic() ? Component1 : Component2;
 * </script>
 *
 * <svelte:component this={component} />
 * <svelte:component this={componentOfCertainSubType} needsThisProp="hello" />
 * ```
 */
export declare type ComponentType<Component extends SvelteComponentTyped = SvelteComponentTyped> = new (options: ComponentConstructorOptions<Component extends SvelteComponentTyped<infer Props> ? Props : Record<string, any>>) => Component;
/**
 * Convenience type to get the props the given component expects. Example:
 * ```html
 * <script lang="ts">
 * 	import type { ComponentProps } from 'svelte';
 * 	import Component from './Component.svelte';
 *
 * 	const props: ComponentProps<Component> = { foo: 'bar' }; // Errors if these aren't the correct props
 * </script>
 * ```
 */
export declare type ComponentProps<Component extends SvelteComponent> = Component extends SvelteComponentTyped<infer Props> ? Props : never;
/**
 * Convenience type to get the events the given component expects. Example:
 * ```html
 * <script lang="ts">
 *    import type { ComponentEvents } from 'svelte';
 *    import Component from './Component.svelte';
 *
 *    function handleCloseEvent(event: ComponentEvents<Component>['close']) {
 *       console.log(event.detail);
 *    }
 * </script>
 *
 * <Component on:close={handleCloseEvent} />
 * ```
 */
export declare type ComponentEvents<Component extends SvelteComponent> = Component extends SvelteComponentTyped<any, infer Events> ? Events : never;
export declare function loop_guard(timeout: any): () => void;
export {};
