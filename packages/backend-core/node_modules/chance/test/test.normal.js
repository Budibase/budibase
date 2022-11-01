import test from 'ava'
import Chance from '../chance.js'
import _ from 'lodash'

// Helper methods
const mean = (arr) => arr.reduce((a, b) => a + b)/arr.length
const stddev = (arr) => {
    var testMean = mean(arr)
    var deviation = arr.map((item) => (item - testMean) * (item - testMean))
    return Math.sqrt(deviation.reduce((a, b) => a + b )/arr.length)
}

const pool = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const chance = new Chance()

test('normal() works as expected with no parameters and returns a number', t => {
    _.times(1000, () => {
        let norm = chance.normal()
        t.is(typeof norm, 'number')
    })
})

test('normal() returns values fairly close to the expected standard deviation and mean', t => {
    let testStddev = 1
    let testMean = 0
    let group = chance.n(chance.normal, 10000)

    t.true(Math.abs(mean(group) - testMean) < testStddev)
    t.true(Math.abs(stddev(group) - testStddev) < testStddev * 0.05)
})

test('normal() works as expected with a pool of custom values provided', t => {
    let testStddev = 0.0000000001
    let testMean = 2

    _.times(1000, () => {
        let norm = chance.normal({ mean: testMean, dev: testStddev, pool: pool })
        t.true(pool.indexOf(norm) !== -1)
    })
})

test('normal() recalculates and returns a value even if the normal() results in indexes outside the bounds of the pool', t => {
    let testStddev = 1.5
    let testMean = 3

    _.times(1000, () => {
        let norm = chance.normal({ mean: testMean, dev: testStddev, pool: pool })
        t.true(pool.indexOf(norm) !== -1)
    })
})

test('normal() can be used with other chance functions', t => {
    let testStddev = 1
    let testMean = 3
    let group = chance.n(chance.normal, 1000, { mean: testMean, dev: testStddev, pool: pool })

    t.true(group.length === 1000)
    t.true(pool.indexOf(group[0]) !== -1)
    t.true(pool.indexOf(group[999]) !== -1)
})

test('normal() should produce a correctly distributed group of pool items', t => {
    let testStddev = 2
    let testMean = 6
    let group = chance.n(chance.normal, 10000, { mean: testMean, dev: testStddev, pool: pool })
    let counts = _.countBy(group)

    t.true(counts.Sunday > counts.Saturday)
    t.true(counts.Saturday > counts.Friday)
    t.true(counts.Friday > counts.Thursday)
    t.true(counts.Thursday > counts.Wednesday)
    t.true(counts.Wednesday > counts.Tuesday)
    t.true(counts.Tuesday > counts.Monday)
})

test('normal() should throw an error quickly if the user has provided bad pool', t => {
    let testStddev = 5
    let testMean = 200
    const fn = () => chance.normal({ mean: testMean, dev: testStddev, pool: pool })
    t.throws(fn, 'Chance: Your pool is too small for the given mean and standard deviation. Please adjust.')
})

test('normal() should throw an error if called with non-number mean', t => {
    let testStddev = 5
    let testMean = []
    const fn = () => chance.normal({ mean: testMean, dev: testStddev, pool: pool })
    t.throws(fn, 'Chance: Mean (mean) must be a number')
})

test('normal() should throw an error if called with non-number stddev', t => {
    let testStddev = []
    let testMean = 5
    const fn = () => chance.normal({ mean: testMean, dev: testStddev, pool: pool })
    t.throws(fn, 'Chance: Standard deviation (dev) must be a number')
})

test('normal() should throw an error if the pool provided is not an array', t => {
    const fn = () => chance.normal({ pool: 'not an array' })
    t.throws(fn, 'Chance: The pool option must be a valid array.')
})

test('normal() should work with objects', t => {
    let testStddev = 1
    let testMean = 1
    let group = chance.n(chance.normal, 50, { mean: testMean, dev: testStddev, pool: [
        { a: 1, b: 10},
        { a: 2, b: 20},
        { a: 3, b: 30}
    ]})

    t.true(group.length === 50)
    t.truthy(group[0]['a'])
})
