import { writable } from "svelte/store"

function createItemsStore(componentOnSelect) {
  const { subscribe, set, update } = writable([])

  function addItem(item) {
    update(items => {
      return [...items, item]
    })
    if (componentOnSelect) {
      componentOnSelect()
    }
  }

  function addSingleItem(item) {
    set([item])
    if (componentOnSelect) {
      componentOnSelect()
    }
  }

  function removeItem(itemId) {
    update(items => {
      let index = getItemIdx(items, itemId)
      items.splice(index, 1)
      return items
    })
    if (componentOnSelect) {
      componentOnSelect()
    }
  }

  function clearItems() {
    set([])
    if (componentOnSelect) {
      componentOnSelect()
    }
  }

  function getItemIdx(items, itemId) {
    return items.findIndex(i => i && i._id === itemId)
  }

  return {
    subscribe,
    addItem,
    addSingleItem,
    removeItem,
    clearItems,
    getItemIdx,
  }
}

export default createItemsStore
