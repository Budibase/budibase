build:
	node-waf build

clean:
	node-waf clean

ifndef only
test: build
	@expresso -I lib test/*.test.js
else
test: build
	@expresso -I lib test/${only}.test.js
endif

.PHONY: build clean test
