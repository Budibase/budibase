# template

Return a random string matching the given template.

```js
// usage
chance.template('{AA####}')
=> 'ZQ7803'
chance.template('{Aa}-{##}')
=> 'Vr-78'
chance.template('{####}:{####}:{####}')
=> '1628:5987:7803'
```

The template consists of any number of "character replacement" and "character
literal" sequences. A "character replacement" sequence starts with a left
brace, has any number of special replacement characters, and ends with a right
brace. A character literal can be any character except a brace or a backslash.
A literal brace or backslash character can be included in the output by
escaping with a backslash.

The following replacement characters can be used in a replacement sequence:

   * "#": a random digit
   * "a": a random lower case letter
   * "A": a random upper case letter

