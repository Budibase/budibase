# Contributing to nano

Please take a moment to review this document in order to make the contribution
process easy and effective for everyone involved.

Following these guidelines helps to communicate that you respect the time of
the developers managing and developing this open source project. In return,
they should reciprocate that respect in addressing your issue, assessing
changes, and helping you finalize your pull requests.

Contributions to CouchDB are governed by our [Code of Conduct][6] and a set of
[Project Bylaws][7]. Apache CouchDB itself also has a [CONTRIBUTING.md][9] if
you want to help with the larger project. Come join us!

# Contributing

Everyone is welcome to contribute with patches, bug-fixes and new features.

1. Create an [issue][2] on github so the community can comment on your idea
2. Fork `nano` in github
3. Create a new branch `git checkout -b my_branch`
4. Create tests for the changes you made
5. Make sure you pass both existing and newly inserted tests
6. Commit your changes
7. Push to your branch `git push origin my_branch`
8. Create a pull request

To run tests, make sure you run `npm test`.

Please fix all issues identified in the pre-commit hooks before sending your patch. if you don't, we will close the patch and ask you to re-open it once you have:

1. 100% code coverage
2. proper codestyle
3. linted all your code

This is not a replacement for appropriate tests, please make sure that you have adequate coverage and thoroughly test the code you introduced.

You can add verbose debug messages while running tests by doing:

```
DEBUG=* node your_nano_scripts.js
```

You can turn nocks on and off using the `NOCK_OFF` environment variable.

[2]: http://github.com/apache/couchdb-nano/issues
[6]: http://couchdb.apache.org/conduct.html
[7]: http://couchdb.apache.org/bylaws.html
[9]: https://github.com/apache/couchdb/blob/master/CONTRIBUTING.md

