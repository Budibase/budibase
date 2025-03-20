import { Readable, Writable } from "svelte/store"

declare module "./memo" {
  export function memo<T>(value?: T): Writable<T | undefined>

  export function derivedMemo<TStore, TResult>(
    store: Readable<TStore>,
    derivation: (store: TStore) => TResult
  ): Readable<TResult>
}
