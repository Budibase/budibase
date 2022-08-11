'use strict';

var utils = require('./pouch-utils');
var version = require('./version');
var ndj = require('ndjson');
var through = require('through2').obj;
var pick = require('lodash.pick');
var toBufferStream = require('./to-buffer-stream');
var DEFAULT_BATCH_SIZE = 50;

// params to the replicate() API that the user is allowed to specify
var ALLOWED_PARAMS = [
  'batch_size',
  'batches_limit',
  'filter',
  'doc_ids',
  'query_params',
  'since',
  'view'
];

exports.adapters = {};
exports.adapters.writableStream = require('./writable-stream');

exports.plugin = require('pouch-stream');

exports.plugin.dump = utils.toPromise(function (writableStream, opts, callback) {
  var self = this;
  /* istanbul ignore else */
  if (typeof opts === 'function') {
    callback = opts;
    opts = {};
  }

  var PouchDB = self.constructor;

  // db.name replaced db._db_name in pouch 6.0.0
  /* istanbul ignore next */
  var dbName = self.name || self._db_name;
  var output = new PouchDB(dbName, {
    adapter: 'writableStream'
  });
  output.setupStream(writableStream);

  var chain = self.info().then(function (info) {
    var header = {
      version: version,
      db_type: self.type(),
      start_time: new Date().toJSON(),
      db_info: info
    };
    writableStream.write(JSON.stringify(header) + '\n');
    opts = pick(opts, ALLOWED_PARAMS);
    if (!opts.batch_size) {
      opts.batch_size = DEFAULT_BATCH_SIZE;
    }
    return self.replicate.to(output, opts);
  }).then(function () {
    return output.close();
  }).then(function () {
    callback(null, {ok: true});
  });
  /* istanbul ignore next */
  function onErr(err) {
    callback(err);
  }
  chain.catch(onErr);
});

exports.plugin.load = utils.toPromise(function (readableStream, opts, callback) {
  /* istanbul ignore else */
  if (typeof opts === 'function') {
    callback = opts;
    opts = {};
  }

  var batchSize;
  /* istanbul ignore if */
  if ('batch_size' in opts) {
    batchSize = opts.batch_size;
  } else {
    batchSize = DEFAULT_BATCH_SIZE;
  }

  // We need this variable in order to call the callback only once.
  // The stream is not closed when the 'error' event is emitted.
  var error = null;

  var queue = [];
  readableStream
  .pipe(toBufferStream())
  .pipe(ndj.parse())
  .on('error', function (errorCatched) {
    error = errorCatched;
  })
  .pipe(through(function (data, _, next) {
    if (!data.docs) {
      return next();
    }
    // lets smooth it out
    data.docs.forEach(function (doc) {
      this.push(doc);
    }, this);
    next();
  }))
  .pipe(through(function (doc, _, next) {
    queue.push(doc);
    if (queue.length >= batchSize) {
      this.push(queue);
      queue = [];
    }
    next();
  }, function (next) {
    if (queue.length) {
      this.push(queue);
    }
    next();
  }))
  .pipe(this.createWriteStream({new_edits: false}))
  .on('error', callback)
  .on('finish', function () {
    callback(error, {ok: true});
  });
});

/* istanbul ignore next */
if (typeof window !== 'undefined' && window.PouchDB) {
  window.PouchDB.plugin(exports.plugin);
  window.PouchDB.adapter('writableStream', exports.adapters.writableStream);
}
