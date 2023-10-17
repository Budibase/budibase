# Amazon DynamoDB Automarshaller

[![Apache 2 License](https://img.shields.io/github/license/awslabs/dynamodb-data-mapper-js.svg?style=flat)](http://aws.amazon.com/apache-2-0/)

This library provides a `Marshaller` class that converts native JavaScript
values to DynamoDB AttributeValues and back again. It's designed to work with
ES6 features like sets, maps, and iterables, and can be configured to support
data types only supported by JavaScript (such as empty binary buffers) or by
Amazon DynamoDB (such as numbers of arbitrary size) with minimal tradeoffs.

## Getting started

To use the `Marshaller` to convert a JavaScript object to the data type expected
by Amazon DynamoDB, simply create an instance of the marshaller and call
`marshallItem`:

```typescript
import {BinarySet, Marshaller} from '@aws/dynamodb-auto-marshaller';

const marshaller = new Marshaller();
const original = {
    string: 'a string',
    number: 1234,
    list: [
        'a',
        'list',
        'of',
        'values',
    ],
    buffer: Buffer.from([0xde, 0xad, 0xbe, 0xef]),
    setOfBuffers: new BinarySet([
        Uint8Array.from([0xde, 0xad]),
        Uint8Array.from([0xbe, 0xef]),
        Uint8Array.from([0xfa, 0xce]),
    ] as Iterable<ArrayBufferView>),
    stringSet: new Set<string>([
        'foo',
        'bar',
        'baz',
    ]),
    any: {
        level: {
            of: {
                nesting: {
                    is: {
                        supported: true
                    }
                }
            }
        }
    },
}

// create a variable ready to be used with DynamoDB's low-level API 
const marshalled = marshaller.marshallItem(original);

// the output of `.marshallItem` can be converted back to a JavaScript type with
// `.unmarshallItem`
const unmarshalled = marshaller.unmarshallItem(original);

// With a few caveats (listed below), the unmarshalled value should have the
// same structure and data as the original value.
deepEqual(original, unmarshalled); // true
```

Values may be converted to and from AttributeValue objects with `.marshallValue`
and `.unmarshallValue` directly:

```typescript
import {Marshaller} from '@aws/dynamodb-auto-marshaller';

const marshaller = new Marshaller();
const marshalled = marshaller.marshallValue('string'); // returns {S: 'string'}
const unmarshalled = marshaller.unmarshallValue(marshalled); // returns 'string'
```

## Caveats

There are a few categories of values that cannot be seamlessly converted between
JavaScript and DynamoDB, such as big numbers, empty values, and mixed-type sets.

### Big number support

By default, the marshaller will unmarshall numeric values returned by DynamoDB
into instances of `NumberValue` rather than into native JavaScript numbers.
Numbers in DynamoDB may have up to 38 digits of precision, which exceeds the
precision available in a JavaScript `number`. `NumberValue` instances therefore
store the value returned by DynamoDB as a string and will only coerce the value
into a JavaScript number when the instance appears in an arithmetic expression,
when it is passed to `JSON.stringify`, or when its `valueOf` method is called.

Similarly, numeric sets are returned as `NumberValueSet` instances that are
compatible with both numbers and `NumberValue`s.

To disable this behavior, pass a configuration options argument to the
`Marshaller` constructor with `unwrapNumbers` set to `true`:

```typescript
import {Marshaller} from '@aws/dynamodb-auto-marshaller';

const marshaller = new Marshaller({unwrapNumbers: true});
```

### Empty value support

DynamoDB's data model requires that strings, sets, and binary attributes have
lengths greater than zero, whereas JavaScript has no such requirement. By
default, the marshaller will not attempt to alter empty values, as the
marshaller would not be able to disambiguate any sigil value used from a field
that was meant to legitimately contain that value.

The marshaller offers two opt-in options for handling empty values, both of
which are controlled using the `onEmpty` configuration option.

Settting `onEmpty` to `'nullify'` will direct the marshaller to convert empty
values to null attribute values (`{NULL: true}`) and persist them to DynamoDB.
This allows consumers of the item to know that an empty value was saved, though
it will be slightly altered. When fetched from DynamoDB, the value will be
unmarshalled as `null`:

```typescript
import {Marshaller} from '@aws/dynamodb-auto-marshaller';

const marshaller = new Marshaller({onEmpty: 'nullify'});
const marshalled = marshaller.marshallValue(''); // returns {NULL: true}
const unmarshalled = marshaller.unmarshallValue(marshalled); // returns null
```

Setting `onEmpty` to `'omit'` will direct the marshaller to remove empty values
from the serialized item:

```typescript
import {Marshaller} from '@aws/dynamodb-auto-marshaller';

const marshaller = new Marshaller({onEmpty: 'omit'});
const marshalled = marshaller.marshallValue(''); // returns undefined
const unmarshalled = marshaller.unmarshallValue(marshalled); // returns undefined
```

### Symbols and functions

By default, the marshaller will throw an error when it encounters a symbol or
function. You can direct the marshaller to instead omit such values from its
output by setting the `onInvalid` configuration option to `'omit'`:

```typescript
import {Marshaller} from '@aws/dynamodb-auto-marshaller';

const marshaller = new Marshaller({onInvalid: 'omit'});
const marshalled = marshaller.marshallValue(Symbol.iterator); // returns undefined
const unmarshalled = marshaller.unmarshallValue(marshalled); // returns undefined
```
