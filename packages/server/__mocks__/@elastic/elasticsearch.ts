const elastic: any = {}

elastic.Client = function () {
  this.index = jest.fn().mockResolvedValue({ body: [] })
  this.search = jest.fn().mockResolvedValue({
    body: {
      hits: {
        hits: [
          {
            _source: {
              name: "test",
            },
          },
        ],
      },
    },
  })
  this.update = jest.fn().mockResolvedValue({ body: [] })
  this.delete = jest.fn().mockResolvedValue({ body: [] })

  this.close = jest.fn()
}

module.exports = elastic
