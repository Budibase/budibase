# use zap to run tests, it also detects CoffeeScript files
xml2js = require '../lib/xml2js'
fs = require 'fs'
util = require 'util'
assert = require 'assert'
path = require 'path'

fileName = path.join __dirname, '/fixtures/sample.xml'

skeleton = (options, checks) ->
  (test) ->
    xmlString = options?.__xmlString
    delete options?.__xmlString
    x2js = new xml2js.Parser options
    x2js.addListener 'end', (r) ->
      checks r
      test.finish()
    if not xmlString
      fs.readFile fileName, (err, data) ->
        x2js.parseString data
    else
      x2js.parseString xmlString
###
The `validator` function validates the value at the XPath. It also transforms the value
if necessary to conform to the schema or other validation information being used. If there
is an existing value at this path it is supplied in `currentValue` (e.g. this is the second or
later item in an array).
If the validation fails it should throw a `ValidationError`.
###
validator = (xpath, currentValue, newValue) ->
  if xpath == '/sample/validatortest/numbertest'
    return Number(newValue)
  else if xpath in ['/sample/arraytest', '/sample/validatortest/emptyarray', '/sample/validatortest/oneitemarray']
    if not ('item' of newValue)
      return {'item': []}
  else if xpath in ['/sample/arraytest/item', '/sample/validatortest/emptyarray/item', '/sample/validatortest/oneitemarray/item']
    if not currentValue
      return [newValue]
  else if xpath == '/validationerror'
    throw new xml2js.ValidationError("Validation error!") 
  return newValue

module.exports =
  'test parse with defaults': skeleton(undefined, (r) ->
    console.log 'Result object: ' + util.inspect(r, false, 10)
    assert.equal r['chartest']['@']['desc'], 'Test for CHARs'
    assert.equal r['chartest']['#'], 'Character data here!'
    assert.equal r['cdatatest']['@']['desc'], 'Test for CDATA'
    assert.equal r['cdatatest']['@']['misc'], 'true'
    assert.equal r['cdatatest']['#'], 'CDATA here!'
    assert.equal r['nochartest']['@']['desc'], 'No data'
    assert.equal r['nochartest']['@']['misc'], 'false'
    assert.equal r['listtest']['item'][0]['#'], 'This is character data!'
    assert.equal r['listtest']['item'][0]['subitem'][0], 'Foo(1)'
    assert.equal r['listtest']['item'][0]['subitem'][1], 'Foo(2)'
    assert.equal r['listtest']['item'][0]['subitem'][2], 'Foo(3)'
    assert.equal r['listtest']['item'][0]['subitem'][3], 'Foo(4)'
    assert.equal r['listtest']['item'][1], 'Qux.'
    assert.equal r['listtest']['item'][2], 'Quux.')

  'test parse with explicitCharkey': skeleton(explicitCharkey: true, (r) ->
    assert.equal r['chartest']['@']['desc'], 'Test for CHARs'
    assert.equal r['chartest']['#'], 'Character data here!'
    assert.equal r['cdatatest']['@']['desc'], 'Test for CDATA'
    assert.equal r['cdatatest']['@']['misc'], 'true'
    assert.equal r['cdatatest']['#'], 'CDATA here!'
    assert.equal r['nochartest']['@']['desc'], 'No data'
    assert.equal r['nochartest']['@']['misc'], 'false'
    assert.equal r['listtest']['item'][0]['#'], 'This is character data!'
    assert.equal r['listtest']['item'][0]['subitem'][0]['#'], 'Foo(1)'
    assert.equal r['listtest']['item'][0]['subitem'][1]['#'], 'Foo(2)'
    assert.equal r['listtest']['item'][0]['subitem'][2]['#'], 'Foo(3)'
    assert.equal r['listtest']['item'][0]['subitem'][3]['#'], 'Foo(4)'
    assert.equal r['listtest']['item'][1]['#'], 'Qux.'
    assert.equal r['listtest']['item'][2]['#'], 'Quux.')

  'test parse with mergeAttrs': skeleton(mergeAttrs: true, (r) ->
    console.log 'Result object: ' + util.inspect(r, false, 10)
    assert.equal r['chartest']['desc'], 'Test for CHARs'
    assert.equal r['chartest']['#'], 'Character data here!'
    assert.equal r['cdatatest']['desc'], 'Test for CDATA'
    assert.equal r['cdatatest']['misc'], 'true'
    assert.equal r['cdatatest']['#'], 'CDATA here!'
    assert.equal r['nochartest']['desc'], 'No data'
    assert.equal r['nochartest']['misc'], 'false'
    assert.equal r['listtest']['item'][0]['#'], 'This is character data!'
    assert.equal r['listtest']['item'][0]['subitem'][0], 'Foo(1)'
    assert.equal r['listtest']['item'][0]['subitem'][1], 'Foo(2)'
    assert.equal r['listtest']['item'][0]['subitem'][2], 'Foo(3)'
    assert.equal r['listtest']['item'][0]['subitem'][3], 'Foo(4)'
    assert.equal r['listtest']['item'][1], 'Qux.'
    assert.equal r['listtest']['item'][2], 'Quux.')

  'test default text handling': skeleton(undefined, (r) ->
    assert.equal r['whitespacetest']['#'], 'Line One Line Two')

  'test disable trimming': skeleton(trim: false, (r) ->
    assert.equal r['whitespacetest']['#'], 'Line One Line Two')

  'test disable normalize': skeleton(normalize: false, (r) ->
    assert.equal r['whitespacetest']['#'], 'Line One\n        Line Two')

  'test disable normalize and trim': skeleton(normalize: false, trim: false, (r) ->
    assert.equal r['whitespacetest']['#'], '\n        Line One\n        Line Two\n    ')

  'test default root node elimination': skeleton(__xmlString: '<root></root>', (r) ->
    assert.deepEqual r, {})

  'test disabled root node elimination': skeleton(__xmlString: '<root></root>', explicitRoot: true, (r) ->
    assert.deepEqual r, {root: {}})

  'test default empty tag result': skeleton(undefined, (r) ->
    assert.deepEqual r['emptytest'], {})

  'test empty tag result specified null': skeleton(emptyTag: null, (r) ->
    assert.equal r['emptytest'], null)

  'test empty string result specified null': skeleton(__xmlString: ' ', (r) ->
    assert.equal r, null)

  'test parse with custom char and attribute object keys': skeleton(attrkey: 'attrobj', charkey: 'charobj', (r) ->
    assert.equal r['chartest']['attrobj']['desc'], 'Test for CHARs'
    assert.equal r['chartest']['charobj'], 'Character data here!'
    assert.equal r['cdatatest']['attrobj']['desc'], 'Test for CDATA'
    assert.equal r['cdatatest']['attrobj']['misc'], 'true'
    assert.equal r['cdatatest']['charobj'], 'CDATA here!'
    assert.equal r['nochartest']['attrobj']['desc'], 'No data'
    assert.equal r['nochartest']['attrobj']['misc'], 'false')

  'test child node without explicitArray': skeleton(explicitArray: false, (r) ->
    assert.equal r['arraytest']['item'][0]['subitem'], 'Baz.'
    assert.equal r['arraytest']['item'][1]['subitem'][0], 'Foo.'
    assert.equal r['arraytest']['item'][1]['subitem'][1], 'Bar.')

  'test child node with explicitArray': skeleton(explicitArray: true, (r) ->
    assert.equal r['arraytest'][0]['item'][0]['subitem'][0], 'Baz.'
    assert.equal r['arraytest'][0]['item'][1]['subitem'][0], 'Foo.'
    assert.equal r['arraytest'][0]['item'][1]['subitem'][1], 'Bar.')

  'test ignore attributes': skeleton(ignoreAttrs: true, (r) ->
    assert.equal r['chartest'], 'Character data here!'
    assert.equal r['cdatatest'], 'CDATA here!'
    assert.deepEqual r['nochartest'], {}
    assert.equal r['listtest']['item'][0]['#'], 'This is character data!'
    assert.equal r['listtest']['item'][0]['subitem'][0], 'Foo(1)'
    assert.equal r['listtest']['item'][0]['subitem'][1], 'Foo(2)'
    assert.equal r['listtest']['item'][0]['subitem'][2], 'Foo(3)'
    assert.equal r['listtest']['item'][0]['subitem'][3], 'Foo(4)'
    assert.equal r['listtest']['item'][1], 'Qux.'
    assert.equal r['listtest']['item'][2], 'Quux.')

  'test simple callback mode': (test) ->
    x2js = new xml2js.Parser()
    fs.readFile fileName, (err, data) ->
      assert.equal err, null
      x2js.parseString data, (err, r) ->
        assert.equal err, null
        # just a single test to check whether we parsed anything
        assert.equal r['chartest']['#'], 'Character data here!'
        test.finish()

  'test double parse': (test) ->
    x2js = new xml2js.Parser()
    fs.readFile fileName, (err, data) ->
      assert.equal err, null
      x2js.parseString data, (err, r) ->
        assert.equal err, null
        # make sure we parsed anything
        assert.equal r['chartest']['#'], 'Character data here!'
        x2js.parseString data, (err, r) ->
          assert.equal err, null
          assert.equal r['chartest']['#'], 'Character data here!'
          test.finish()

  'test validator': skeleton(validator: validator, (r) ->
    assert.equal typeof r['validatortest']['stringtest'], 'string'
    assert.equal typeof r['validatortest']['numbertest'], 'number'
    assert.ok r['validatortest']['emptyarray']['item'] instanceof Array
    assert.equal r['validatortest']['emptyarray']['item'].length, 0
    assert.ok r['validatortest']['oneitemarray']['item'] instanceof Array
    assert.equal r['validatortest']['oneitemarray']['item'].length, 1
    assert.equal r['validatortest']['oneitemarray']['item'], 'Bar.'
    assert.ok r['arraytest']['item'] instanceof Array
    assert.equal r['arraytest']['item'].length, 2
    assert.equal r['arraytest']['item'][0]['subitem'], 'Baz.'
    assert.equal r['arraytest']['item'][1]['subitem'][0], 'Foo.'
    assert.equal r['arraytest']['item'][1]['subitem'][1], 'Bar.')

  'test validation error': (test) ->
    x2js = new xml2js.Parser({validator: validator})
    x2js.parseString '<validationerror/>', (err, r) ->
      assert.equal err, 'Validation error!' 
      test.finish()
