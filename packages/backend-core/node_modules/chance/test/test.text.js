import test from 'ava'
import Chance from '../chance.js'
import _ from 'lodash'

const chance = new Chance()

// chance.sentence()
test('sentence() returns a random sentence', t => {
    _.times(1000, () => {
        let sentence = chance.sentence()
        t.true(_.isString(sentence))
        let len = sentence.split(' ').length
        t.true(len > 11)
        t.true(len < 19)
    })
})

test('sentence() will obey bounds', t => {
    _.times(1000, () => {
        let sentence = chance.sentence({ words: 5 })
        t.true(_.isString(sentence))
        t.is(sentence.split(' ').length, 5)
        t.true(/[a-zA-Z]+ [a-zA-Z]+ [a-zA-Z]+ [a-zA-Z]+ [a-zA-Z]+.?/m.test(sentence))
    })
})

// chance.syllable()
test('syllable() returns a random syllable', t => {
    _.times(1000, () => {
        let syllable = chance.syllable()
        t.true(_.isString(syllable))
        t.true(syllable.length > 1)
        t.true(syllable.length < 4)
    })
})

test('syllable() obeys the capitalize option', t => {
    _.times(1000, () => {
        let syllable = chance.syllable({ capitalize: true })
        t.true(_.isString(syllable))
        t.true(syllable.length > 1)
        t.true(syllable.length < 4)
        t.true(/[A-Z]+/.test(syllable))
    })
})

// chance.word()
test('word() returns a random word', t => {
    _.times(1000, () => {
        let word = chance.word()
        t.true(_.isString(word))
        t.true(word.length > 1)
        t.true(word.length < 10)
    })
})

test('word() obeys the capitalize option', t => {
    _.times(1000, () => {
        let word = chance.word({ capitalize: true })
        t.true(_.isString(word))
        t.true(word.length > 1)
        t.true(word.length < 10)
        t.true(word.charAt(0) === word.charAt(0).toUpperCase())
    })
})

test('word() can have a set number of syllables', t => {
    _.times(1000, () => {
        let word = chance.word({ syllables: 3 })
        t.true(_.isString(word))
        t.true(word.length > 5)
        t.true(word.length < 10)
    })
})

test('word() can have a set length', t => {
    _.times(1000, () => {
        let word = chance.word({ length: 5 })
        t.true(_.isString(word))
        t.is(word.length, 5)
    })
})

test('word() throws if both syllables and length specified', t => {
    const fn = () => chance.word({ syllables: 3, length: 20 })
    t.throws(fn, 'Chance: Cannot specify both syllables AND length.')
})

// chance.paragraph()
test('paragraph() returns a random paragraph', t => {
    _.times(100, () => {
        let paragraph = chance.paragraph()
        t.true(_.isString(paragraph))

        let len = paragraph.split('.').length
        t.true(len > 2)
        t.true(len < 9)
    })
})

test('paragraph() will obey bounds', t => {
    _.times(100, () => {
        let paragraph = chance.paragraph({ sentences: 5 })
        t.true(_.isString(paragraph))

        // Have to account for the fact that the period at the end will add
        // to the count of sentences. This is the fault of our hackish way
        // of detecting sentences -- by splitting on '.'
        let len = paragraph.split('.').length
        t.is(len, 6)
    })
})
