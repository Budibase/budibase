import { Fragment, FragmentFactory } from './types';
interface PromiseInfo<T> {
    ctx: null | any;
    token: {};
    hasCatch: boolean;
    pending: FragmentFactory;
    then: FragmentFactory;
    catch: FragmentFactory;
    value: number;
    error: number;
    resolved?: T;
    current: FragmentFactory | null;
    block: Fragment | null;
    blocks: [null | Fragment, null | Fragment, null | Fragment];
    mount: () => HTMLElement;
    anchor: HTMLElement;
}
export declare function handle_promise<T>(promise: Promise<T>, info: PromiseInfo<T>): boolean;
export declare function update_await_block_branch(info: any, ctx: any, dirty: any): void;
export {};
