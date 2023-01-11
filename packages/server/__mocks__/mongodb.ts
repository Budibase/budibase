module MongoMock {
  const mongodb: any = {}

  mongodb.MongoClient = function () {
    this.connect = jest.fn()
    this.close = jest.fn()
    this.insertOne = jest.fn()
    this.insertMany = jest.fn(() => ({ toArray: () => [] }))
    this.find = jest.fn(() => ({ toArray: () => [] }))
    this.findOne = jest.fn()
    this.findOneAndUpdate = jest.fn()
    this.count = jest.fn()
    this.deleteOne = jest.fn()
    this.deleteMany = jest.fn(() => ({ toArray: () => [] }))
    this.updateOne = jest.fn()
    this.updateMany = jest.fn(() => ({ toArray: () => [] }))

    this.collection = jest.fn(() => ({
      insertOne: this.insertOne,
      find: this.find,
      insertMany: this.insertMany,
      findOne: this.findOne,
      findOneAndUpdate: this.findOneAndUpdate,
      count: this.count,
      deleteOne: this.deleteOne,
      deleteMany: this.deleteMany,
      updateOne: this.updateOne,
      updateMany: this.updateMany,
    }))

    this.db = () => ({
      collection: this.collection,
    })
  }

  mongodb.ObjectId = jest.requireActual("mongodb").ObjectId

  module.exports = mongodb
}
