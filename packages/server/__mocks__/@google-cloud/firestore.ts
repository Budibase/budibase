module FirebaseMock {
  const firebase: any = {}

  firebase.Firestore = function () {
    this.get = jest.fn(() => [
      {
        data: jest.fn(() => ({ result: "test" })),
      },
    ])

    this.update = jest.fn()
    this.set = jest.fn()
    this.delete = jest.fn()

    this.doc = jest.fn(() => ({
      update: this.update,
      set: this.set,
      delete: this.delete,
      get: jest.fn(() => ({
        data: jest.fn(() => ({ result: "test" })),
      })),
      id: "test_id",
    }))

    this.where = jest.fn(() => ({
      get: this.get,
    }))

    this.collection = jest.fn(() => ({
      doc: this.doc,
      where: this.where,
    }))
  }

  module.exports = firebase
}
