const mongodb = {}

mongodb.MongoClient = function() {
  this.connect = jest.fn()
  this.close = jest.fn()
  this.insertOne = jest.fn()
  this.find = jest.fn(() => ({ toArray: () => [] }))

  this.collection = jest.fn(() => ({
    insertOne: this.insertOne,
    find: this.find,
  }))

  this.db = () => ({
    collection: this.collection,
  })
}

module.exports = mongodb
