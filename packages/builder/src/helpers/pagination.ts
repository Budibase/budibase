import { writable } from "svelte/store"

interface PaginationStore {
  nextPage: string | null | undefined
  page: string | null | undefined
  hasPrevPage: boolean
  hasNextPage: boolean
  loading: boolean
  pageNumber: number
  pages: string[]
}

function defaultValue(): PaginationStore {
  return {
    nextPage: null,
    page: undefined,
    hasPrevPage: false,
    hasNextPage: false,
    loading: false,
    pageNumber: 1,
    pages: [],
  }
}

export function createPaginationStore() {
  const { subscribe, set, update } = writable(defaultValue())

  function prevPage() {
    update(state => {
      state.pageNumber--
      state.nextPage = state.pages.pop()
      state.page = state.pages[state.pages.length - 1]
      state.hasPrevPage = state.pageNumber > 1
      return state
    })
  }

  function nextPage() {
    update(state => {
      state.pageNumber++
      state.page = state.nextPage
      state.pages.push(state.page!)
      state.hasPrevPage = state.pageNumber > 1
      return state
    })
  }

  function fetched(hasNextPage: boolean, nextPage: string) {
    update(state => {
      state.hasNextPage = hasNextPage
      state.nextPage = nextPage
      state.loading = false
      return state
    })
  }

  function loading(loading = true) {
    update(state => {
      state.loading = loading
      return state
    })
  }

  function reset() {
    set(defaultValue())
  }

  return {
    subscribe,
    prevPage,
    nextPage,
    fetched,
    loading,
    reset,
  }
}
