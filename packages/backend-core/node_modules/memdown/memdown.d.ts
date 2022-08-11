import { AbstractLevelDOWN } from 'abstract-leveldown';

export interface MemDown<K=any, V=any>
  extends AbstractLevelDOWN<K, V, {}, {}, MemDownGetOptions, {}, MemDownIteratorOptions, {}> {
}

interface MemDownConstructor {
  new <K=any, V=any>(location: string): MemDown<K, V>;
  <K=any, V=any>(location: string): MemDown<K, V>;
}

export interface MemDownGetOptions {
  asBuffer?: boolean;
}

export interface MemDownIteratorOptions {
  keyAsBuffer?: boolean;
  valueAsBuffer?: boolean;
}

export function clearGlobalStore(strict?: boolean);
export function destroy(location: string, cb: () => void): void;

declare const MemDown: MemDownConstructor;
export default MemDown;