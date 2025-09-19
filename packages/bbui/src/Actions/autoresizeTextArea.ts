function resize(e: Event) {
  const target = e.target as HTMLTextAreaElement
  target.style.height = "1px"
  target.style.height = +target.scrollHeight + "px"
}

export default function (el: HTMLTextAreaElement) {
  resize({ target: el } as any)
  el.style.overflow = "hidden"
  el.addEventListener("input", resize)

  return {
    destroy: () => el.removeEventListener("input", resize),
  }
}
