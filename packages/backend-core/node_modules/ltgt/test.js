var tape = require('tape')
var ltgt = require('./')

function clone (o) {
  var O = {}
  for(var k in o)
    O[k] = o[k]
  return O
}

var elements = [
  1, 2, 3, 4, 5
]

var ranges = [
  //default
  { range:
      {},
    selection:
      elements
  },
  { range:
      {reverse: true },
    selection:
      elements.slice().reverse()
  },

  //start/end - this has a lot of semantics because reverse is significant.
  { range:
      {start: 2},
    selection:
      [2, 3, 4, 5]
  },
  { range:
      {start: 2, reverse: true},
    selection:
      [2, 1]
  },
  { range:
      {end: 2},
    selection:
      [1, 2]
  },
  { range:
      {end: 2, reverse: true},
    selection:
      [2, 3, 4, 5].reverse()
  },
  { range:
      {start: 2.5},
    selection:
      [3, 4, 5]
  },
  { range:
      {start: 2.5, reverse: true},
    selection:
      [2, 1]
  },
  { range:
      {end: 2.5, reverse: true},
    selection:
      [5, 4, 3]
  },
  { range:
      {start: 5},
    selection:
      [5]
  },
  { range:
      {start: 5.5},
    selection:
      []
  },
  { range:
      {end: 0.5},
    selection:
      []
  },
  { range:
      {start: 5.5, reverse: true},
    selection:
      [5, 4, 3, 2, 1]
  },
  { range:
      {end: 0.5, reverse: true},
    selection:
      [5, 4, 3, 2, 1]
  },

  //nullish and empty strings signify are streated like null!
  { range:
      {end: null, reverse: true},
    selection:
      [5, 4, 3, 2, 1]
  },
  { range:
      {end: undefined, reverse: true},
    selection:
      [5, 4, 3, 2, 1]
  },
  { range:
      {end: '', reverse: true},
    selection:
      [5, 4, 3, 2, 1]
  },

  //lt/gt/lte/gte

  { range:
      {lt: 2.5},
    selection:
      [1, 2]
  },
  { range:
      {gt: 2.5},
    selection:
      [3, 4, 5]
  },
  { range:
      {lt: 2},
    selection:
      [1]
  },
  { range:
      {gt: 2},
    selection:
      [3, 4, 5]
  },

  { range:
      {lte: 2.5},
    selection:
      [1, 2]
  },
  { range:
      {gte: 2.5},
    selection:
      [3, 4, 5]
  },
  { range:
      {lte: 2},
    selection:
      [1, 2]
  },
  { range:
      {gte: 2},
    selection:
      [2, 3, 4, 5]
  },

  { range:
      {gt: 2.5, lt: 5},
    selection:
      [3, 4]
  },
  { range:
      {gte: 2, lt: 3.5},
    selection:
      [2, 3]
  },
  { range:
      {gt: 2.5, lte: 4},
    selection:
      [3, 4]
  },
  { range:
      {gte: 2, lte: 4},
    selection:
      [2, 3, 4]
  },

  //min/max - used by sublevel, equiv to gte, lte

  { range:
      {min: 2, max: 4},
    selection:
      [2, 3, 4]
  },

  { range:
      {max: 2.5},
    selection:
      [1, 2]
  },
  { range:
      {min: 2.5},
    selection:
      [3, 4, 5]
  },
  { range:
      {max: 2},
    selection:
      [1, 2]
  },
  { range:
      {min: 2},
    selection:
      [2, 3, 4, 5]
  }

]


tape('upperBound', function (t) {
  t.equal('b', ltgt.upperBound({start: 'b', reverse: true}))
  t.equal('b', ltgt.upperBound({end: 'b', reverse: false}))
  t.equal(undefined, ltgt.lowerBound({start: 'b', reverse: true}))
  t.equal(undefined, ltgt.lowerBound({end: 'b', reverse: false}))
  t.end()
})

tape('bounds and inclusive', function (t) {
//  t.equal(ltgt.upperBound({start: 'b', reverse: true}), 'b')
//  t.equal(ltgt.upperBoundInclusive({start: 'b', reverse: true}), true)
//  t.equal(ltgt.upperBound({end: 'b', reverse: false}), 'b')
//
//  t.equal(ltgt.lowerBound({start: 'b', reverse: true}), undefined)
//  t.equal(ltgt.lowerBound({end: 'b', reverse: false}), undefined)
//  t.equal(ltgt.upperBoundInclusive({start: 'b', reverse: true}), true)
//  t.equal(ltgt.upperBoundInclusive({end: 'b', reverse: false}), true)
//
  t.equal(ltgt.upperBound({lt: 'b', reverse: true}), 'b')
  t.equal(ltgt.upperBound({lte: 'b', reverse: true}), 'b')

  t.equal(ltgt.upperBound({lt: 'b'}), 'b')
  t.equal(ltgt.upperBound({lte: 'b'}), 'b')

  t.equal(ltgt.upperBoundInclusive({lt: 'b'}), false)

  t.equal(ltgt.upperBoundInclusive({lte: 'b'}), true)

  t.equal(ltgt.lowerBoundInclusive({gt: 'b'}), false)
  t.equal(ltgt.lowerBoundInclusive({gte: 'b'}), true)


  t.end()
})


tape('start, end', function (t) {
//  t.equal(ltgt.upperBound({start: 'b', reverse: true}), 'b')
//  t.equal(ltgt.upperBoundInclusive({start: 'b', reverse: true}), true)
//  t.equal(ltgt.upperBound({end: 'b', reverse: false}), 'b')
//
//  t.equal(ltgt.lowerBound({start: 'b', reverse: true}), undefined)
//  t.equal(ltgt.lowerBound({end: 'b', reverse: false}), undefined)
//  t.equal(ltgt.upperBoundInclusive({start: 'b', reverse: true}), true)
//  t.equal(ltgt.upperBoundInclusive({end: 'b', reverse: false}), true)

  t.equal(ltgt.start({lt: 'b', reverse: true}), 'b')
  t.equal(ltgt.start({lte: 'b', reverse: true}), 'b')
  t.equal(ltgt.end({lt: 'b', reverse: true}, null), null)
  t.equal(ltgt.end({lte: 'b', reverse: true}, null), null)

  t.equal(ltgt.end({lt: 'b'}), 'b')
  t.equal(ltgt.end({lte: 'b'}), 'b')
  t.equal(ltgt.start({lt: 'b'}, undefined), undefined)
  t.equal(ltgt.start({lte: 'b'}, undefined), undefined)

  t.equal(ltgt.endInclusive({lt: 'b'}), false)

  t.equal(ltgt.endInclusive({lte: 'b'}), true)

  t.equal(ltgt.startInclusive({gt: 'b'}), false)
  t.equal(ltgt.startInclusive({gte: 'b'}), true)


  t.end()
})


var strings = ['00', '01', '02']
var sranges = [
  {range:
    {start: '00'},
    selection:
      ['00', '01', '02']
  },
  {range:
    {start: '03', reverse: true},
    selection:
      ['02', '01', '00']
  },

]
function compare (a, b) {
  return a - b
}

make(elements, ranges)

make(strings, sranges)
make(elements.map(String), ranges.map(function (e) {
  var r = {}
  for(var k in e.range)
    if('number' === typeof e.range[k])
      r[k] = e.range.toString()
  return {range: e.range, selection: e.selection.map(String)}
}))

function make (elements, ranges) {

  ranges.forEach(function (e) {

    tape(JSON.stringify(e.range) + ' => '+ JSON.stringify(e.selection),
      function (t) {
        var actual = elements.filter(ltgt.filter(e.range))
        if(e.range.reverse)
          actual.reverse()
        t.deepEqual(actual, e.selection, 'test range:' + JSON.stringify(e.range))

        var range = ltgt.toLtgt(e.range)
        //should not just return the same thing.
        t.notOk(range.min || range.max || range.start || range.end)

        var actual2 = elements.filter(ltgt.filter(range))
        if(e.range.reverse)
          actual2.reverse()
        t.deepEqual(actual2, e.selection)
        
        t.end()
      })
  })
}


function createLtgtTests(mutate) {
  return function (t) {
    function map (key) {
      return 'foo!' + key
    }

    function T (expected, input) {
      input = clone(input)
      t.deepEqual(
        expected,
        ltgt.toLtgt(input, mutate ? input : null, map, '!', '~')
      )
    }

    //start, end

    T({gte: 'foo!a', lte: 'foo!b'}, {start: 'a', end:'b'})
    T({gte: 'foo!a', lte: 'foo!~'}, {start: 'a'})
    T({gte: 'foo!!', lte: 'foo!b'}, {end: 'b'})

    T({gte: 'foo!a', lte: 'foo!b', reverse: true},
      {start: 'b', end: 'a', reverse: true})

    // min, max

    T({gte: 'foo!a', lte: 'foo!b'}, {min: 'a', max:'b'})
    T({gte: 'foo!a', lte: 'foo!~'}, {min: 'a'})
    T({gte: 'foo!!', lte: 'foo!b'}, {max: 'b'})
    T({gte: 'foo!!', lte: 'foo!~'}, {})

    // lt, gt

    T({gt: 'foo!a', lt: 'foo!b'}, {gt: 'a', lt:'b'})
    T({gt: 'foo!a', lte: 'foo!~'}, {gt: 'a'})
    T({gte: 'foo!!', lt: 'foo!b'}, {lt: 'b'})
    T({gte: 'foo!!', lte: 'foo!~'}, {})

    // lt, gt

    T({gte: 'foo!a', lte: 'foo!b'}, {gte: 'a', lte:'b'})
    T({gte: 'foo!a', lte: 'foo!~'}, {gte: 'a'})
    T({gte: 'foo!!', lte: 'foo!b'}, {lte: 'b'})
    T({gte: 'foo!!', lte: 'foo!~'}, {})

    t.end()
  }
}

tape('toLtgt - immutable', createLtgtTests(false))
tape('toLtgt - mutable', createLtgtTests(true))




