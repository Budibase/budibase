const util = require('util')
const AbstractChainedBatch = require('abstract-leveldown').AbstractChainedBatch
const binding = require('./binding')

function ChainedBatch (db) {
  AbstractChainedBatch.call(this, db)
  this.context = binding.batch_init(db.context)
}

ChainedBatch.prototype._put = function (key, value) {
  binding.batch_put(this.context, key, value)
}

ChainedBatch.prototype._del = function (key) {
  binding.batch_del(this.context, key)
}

ChainedBatch.prototype._clear = function () {
  binding.batch_clear(this.context)
}

ChainedBatch.prototype._write = function (options, callback) {
  binding.batch_write(this.context, options, callback)
}

util.inherits(ChainedBatch, AbstractChainedBatch)

module.exports = ChainedBatch
