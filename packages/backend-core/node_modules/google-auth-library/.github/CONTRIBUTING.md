# How to become a contributor and submit your own code

## Contributor License Agreements

We'd love to accept your sample apps and patches! Before we can take them, we
have to jump a couple of legal hurdles.

Please fill out either the individual or corporate Contributor License Agreement
(CLA).

 * If you are an individual writing original source code and you're sure you own
   the intellectual property, then you'll need to sign an [individual CLA][7]

 * If you work for a company that wants to allow you to contribute your work,
   then you'll need to sign a [corporate CLA][8].

Follow either of the two links above to access the appropriate CLA and
insructions for how to sign and return it. Once we receive it, we'll be able to
accept your pull requests.

## Issue reporting

* Check that the issue has not [already been reported][1].
* Check that the issue has not already been fixed in the latest code
  (a.k.a. `master`).
* Be clear, concise and precise in your description of the problem.
* Open an issue with a descriptive title and a summary in grammatically correct,
  complete sentences.
* Include any relevant code to the issue summary.


## Pull requests

* Read [how to properly contribute to open source projects on Github][2].
* Fork the project.
* Install all dependencies including development requirements by running: `$ npm install -d`
* Use a topic/feature branch to easily amend a pull request later, if necessary.
* Write [good commit messages][3].
* Use the same coding conventions as the rest of the project.
* Commit and push until you are happy with your contribution.
* Make sure to add tests for it. This is important so I don't break it
  in a future version unintentionally.
* Add an entry to the [Changelog](CHANGELOG.md) accordingly. See
  [changelog entry format](#changelog-entry-format).
* Please try not to mess with the package.json or version. If you want to
  have your own version, or is otherwise necessary, that is fine, but please
  isolate to its own commit so I can cherry-pick around it.
* Make sure the test suite is passing
  * Tests are run using mocha. To run all tests just run: `$ npm test`
    which looks for tests in the `test/` directory.
* In addition, you must run the [google-api-nodejs-client][9] tests,
which depend upon this library. Clone a copy of the
[google-api-nodejs-client][9] repo, update the dependency to point to
your local copy of the google-auth-library-nodejs repo, and ensure that the
client tests still pass.
* Make sure the no new style offenses are added. Your code should honor the
  [Google JavaScript Style Guide][6].
  * At least make sure no jslint errors occur.  This run using npm as follows: `$ npm run lint`
* [Squash related commits together][5].
* Open a [pull request][4] that relates to *only* one subject with a clear title
  and description in grammatically correct, complete sentences.


### Changelog entry format

Here are a few examples:

```
* Obtains the instance email and key from gtoken ([@stephenplusplus][])
* [#36](google/google-auth-library-nodejs#36) Adds an implementation of IAM authorization ([@tbetbetbe][])
```


## Preparing for release

Before releasing a new version, you should run tests,
bump the version in `package.json` and create a git tag for the release. You
can automate all this with a patch version bump (version += 0.0.1) by running:

``` sh
npm run prepare
```

[1]: https://github.com/google/google-auth-nodejs-library/issues
[2]: http://gun.io/blog/how-to-github-fork-branch-and-pull-request
[3]: http://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html
[4]: https://help.github.com/articles/using-pull-requests
[5]: http://gitready.com/advanced/2009/02/10/squashing-commits-with-rebase.html
[6]: https://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml
[7]: https://developers.google.com/open-source/cla/individual
[8]: https://developers.google.com/open-source/cla/corporate
[9]: https://github.com/google/google-api-nodejs-client
