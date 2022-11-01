# locale

```js
// usage
chance.locale()
chance.locale({region: true})
```

Generate a random ISO-639-1 language code

```js
chance.locale();
=> 'ca'
```

Generate a random IETF region code

```js
chance.locale({region: true});
=> 'es-EA'
```


_Note, the language codes comes from the [ISO-639-1 spec](http://www.loc.gov/standards/iso639-2/php/code_list.php)
and the region codes come from [IETF standard](http://data.okfn.org/data/core/language-codes#resource-language-codes-full)_
