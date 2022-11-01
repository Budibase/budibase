import test from 'ava'
import Chance from '../chance.js'
import _ from 'lodash'

const chance = new Chance()

const fileExtensions = {
    "raster": [ "bmp", "gif", "gpl", "ico", "jpeg", "psd", "png", "psp", "raw",
                "tiff" ],
    "vector": [ "3dv", "amf", "awg", "ai", "cgm", "cdr", "cmx", "dxf", "e2d",
                "egt", "eps", "fs", "odg", "svg", "xar" ],
    "3d": [ "3dmf", "3dm", "3mf", "3ds", "an8", "aoi", "blend", "cal3d", "cob",
            "ctm", "iob", "jas", "max", "mb", "mdx", "obj", "x", "x3d" ],
    "document": [ "doc", "docx", "dot", "html", "xml", "odt", "odm", "ott", "csv",
                  "rtf", "tex", "xhtml", "xps" ]
}

// chance.file()
test('file() returns random file length with random extension', t => {
    _.times(1000, () => {
        let file = chance.file()
        t.true(_.isString(file))
        t.is(file.split('.').length, 2)
    })
})

test('file() returns error if wrong fileType provided', t => {
    _.times(1000, () => {
        const fn = () => chance.file({ fileType: 'not_specified' })
        t.throws(fn, 'Chance: Expect file type value to be \'raster\', \'vector\', \'3d\' or \'document\'')
    })
})

test('file() does not return error if legit fileType provided', t => {
    _.times(1000, () => {
        const fn = () => chance.file({ fileType: 'raster' })
        t.notThrows(fn)
    })
})

test('file() returns filename with specific extension type', t => {
    _.times(1000, () => {
        let file = chance.file({ fileType: 'raster' })
        t.true(_.isString(file))
        let extension = file.split('.')[1]
        t.true(fileExtensions['raster'].indexOf(extension) !== -1)
    })
})

test('file() returns filename with specific extension', t => {
    _.times(1000, () => {
        let file = chance.file({ extension: 'doc' })
        let extension = file.split('.')[1]
        t.is(extension, 'doc')
    })
})

test('file() can take a length and obey it', t => {
    _.times(1000, () => {
        let length = chance.d10()
        let file = chance.file({ length: length })
        let filename = file.split('.')[0]
        t.is(filename.length, length)
    })
})

test('file() can take a pool of extensions and obey them', t => {
    _.times(1000, () => {
        let extensions = [ 'bmp', '3dv', '3dmf', 'doc' ]
        let file = chance.file({ extensions: extensions })
        let extension = file.split('.')[1]
        t.true(extensions.indexOf(extension) !== -1)
    })
})

test('file() can take pool of extensions by object collection and obey them', t => {
    const objectExtensionCollection = {
        "one": [ "extension_one_1", "extension_one_2", "extension_one_3" ],
        "two": [ "extension_two_1", "extension_two_2", "extension_two_3" ],
        "three": [ "extension_three_1", "extension_three_2", "extension_three_3" ]
    }

    _.times(1000, () => {
        let file = chance.file({ extensions: objectExtensionCollection })
        let extension = file.split('.')[1]
        let extensionCount = 0
        for (let key in objectExtensionCollection) {
            let collection = objectExtensionCollection[key]
            collection.map((ext) => {
                if (ext === extension) {
                    extensionCount++
                }
            })
        }
        t.is(extensionCount, 1)
    })
})

test('file() throws if bad extensions option provided', t => {
    const fn = () => chance.file({ extensions: 10 })
    t.throws(fn, 'Chance: Extensions must be an Array or Object')
})

test('file() does not throw if good extensions option provided as array', t => {
    _.times(1000, () => {
        const fn = () => chance.file({ extensions: fileExtensions.document })
        t.notThrows(fn)
    })
})

test('file() does not throw if good extensions option provided as object', t => {
    _.times(1000, () => {
        const fn = () => chance.file({ extensions: fileExtensions })
        t.notThrows(fn)
    })
})
