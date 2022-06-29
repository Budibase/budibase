export class PageInfo {
  constructor(fetch) {
    this.reset()
    this.fetch = fetch
  }

  async goToNextPage() {
    this.pageNumber++
    this.prevPage = this.page
    this.page = this.nextPage
    this.hasPrevPage = this.pageNumber > 1
    await this.fetch(this.page)
  }

  async goToPrevPage() {
    this.pageNumber--
    this.nextPage = this.page
    this.page = this.prevPage
    this.hasPrevPage = this.pageNumber > 1
    await this.fetch(this.page)
  }

  reset() {
    this.prevPage = null
    this.nextPage = null
    this.page = undefined
    this.hasPrevPage = false
    this.hasNextPage = false
    this.pageNumber = 1
  }
}
