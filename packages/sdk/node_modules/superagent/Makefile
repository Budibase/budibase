
NODETESTS ?= test/*.js test/node/*.js
BROWSERTESTS ?= test/*.js test/client/*.js
REPORTER = spec

test:
	@if [ "x$(BROWSER)" = "x" ]; then make test-node; else make test-browser; fi

test-node:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--require should \
		--trace-warnings \
		--throw-deprecation \
		--reporter $(REPORTER) \
		--timeout 5000 \
		$(NODETESTS)

test-node-http2:
	@NODE_ENV=test HTTP2_TEST=1 node ./node_modules/.bin/mocha \
		--require should \
		--trace-warnings \
		--throw-deprecation \
		--reporter $(REPORTER) \
		--timeout 5000 \
		$(NODETESTS)

test-cov: lib-cov
	SUPERAGENT_COV=1 $(MAKE) test REPORTER=html-cov > coverage.html

test-browser:
	SAUCE_APPIUM_VERSION=1.7 ./node_modules/.bin/zuul -- $(BROWSERTESTS)

test-browser-local:
	./node_modules/.bin/zuul --no-coverage --local 4000 -- $(BROWSERTESTS)

lib-cov:
	jscoverage lib lib-cov

test-server:
	@node test/server

docs: index.html test-docs docs/index.md

index.html: docs/index.md docs/head.html docs/tail.html
	marked < $< \
		| cat docs/head.html - docs/tail.html \
		> $@

docclean:
	rm -f index.html docs/test.html

test-docs: docs/head.html docs/tail.html
	make test REPORTER=doc \
		| cat docs/head.html - docs/tail.html \
		> docs/test.html

clean:
	rm -fr components

.PHONY: test-cov test docs test-docs clean test-browser-local
