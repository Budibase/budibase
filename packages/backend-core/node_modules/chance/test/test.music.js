import test from 'ava'
import Chance from '../chance.js'
import _ from 'lodash'

const chance = new Chance()

// chance.note()
test('note() returns a valid note', t => {
    _.times(1000, () => {
      let note = chance.note()
      t.true(_.isString(note))
      t.true(note.length <= 2)
    })
})

// chance.midi_note()
test('midi_note() returns a valid midi note between 0 and 127', t => {
    _.times(1000, () => {
        let midi_note = chance.midi_note()
        t.true(_.isNumber(midi_note))
        t.true(midi_note >= 0)
        t.true(midi_note <= 127)
    })
})

// chance.chord_quality()
test('chord_quality() returns a valid chord quality', t => {
    _.times(1000, () => {
        let chord_quality = chance.chord_quality()
        t.true(_.isString(chord_quality))
        t.true(chord_quality.length <= 4)
    })
})

// chance.chord()
test('chord() returns a valid chord', t => {
    _.times(1000, () => {
        let chord = chance.chord()
        t.true(_.isString(chord))
        t.true(chord.length <= 6)
    })
})

// chance.tempo()
test('tempo() returns a valid tempo between 40 and 320', t => {
    _.times(1000, () => {
        let tempo = chance.tempo()
        t.true(_.isNumber(tempo))
        t.true(tempo >= 40)
        t.true(tempo <= 320)
    })
})