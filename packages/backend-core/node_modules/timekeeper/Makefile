TESTS = $(wildcard test/*.test.js)
REPORTER = dot

install:; @npm install

test: test.node test.browser

test.node:
	@NODE_ENV=test ./node_modules/.bin/mocha \
	  --require test/node.support \
		--reporter $(REPORTER) \
		$(TESTS)

test.browser:
	@NODE_ENV=test ./node_modules/.bin/mocha-phantomjs test/index.html \
		--reporter $(REPORTER)

.PHONY: test test.node test.browser
