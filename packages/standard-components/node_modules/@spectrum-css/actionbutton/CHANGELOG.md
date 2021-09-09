# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

<a name="1.0.3"></a>
## 1.0.3
🗓 2021-04-22 • 📝 [Commits](https://github.com/adobe/spectrum-css/compare/@spectrum-css/actionbutton@1.0.2...@spectrum-css/actionbutton@1.0.3)

### 🐛 Bug fixes

* change disabled buttons to not show selection per spectrum ([37f4fee](https://github.com/adobe/spectrum-css/commit/37f4fee))
* high contrast mode for actionButton ([12028fa](https://github.com/adobe/spectrum-css/commit/12028fa))
* remove comment ([07c5e01](https://github.com/adobe/spectrum-css/commit/07c5e01))
* revise fixes to meet spectrum WHCM definition ([a4f0be4](https://github.com/adobe/spectrum-css/commit/a4f0be4))





<a name="1.0.2"></a>
## 1.0.2
🗓 2021-04-15 • 📝 [Commits](https://github.com/adobe/spectrum-css/compare/@spectrum-css/actionbutton@1.0.1...@spectrum-css/actionbutton@1.0.2)

**Note:** Version bump only for package @spectrum-css/actionbutton





<a name="1.0.1"></a>
## 1.0.1
🗓 2021-03-10 • 📝 [Commits](https://github.com/adobe/spectrum-css/compare/@spectrum-css/actionbutton@1.0.0...@spectrum-css/actionbutton@1.0.1)

**Note:** Version bump only for package @spectrum-css/actionbutton





<a name="1.0.0"></a>
# 1.0.0
🗓 2021-02-02 • 📝 [Commits](https://github.com/adobe/spectrum-css/compare/@spectrum-css/actionbutton@1.0.0-beta.1...@spectrum-css/actionbutton@1.0.0)

**Note:** Version bump only for package @spectrum-css/actionbutton





<a name="1.0.0-beta.1"></a>
# 1.0.0-beta.1
🗓 2020-12-04

### ♻️ Code refactoring

* fix padding ([89a6506](https://github.com/adobe/spectrum-css/commit/89a6506))


### ✨ Features

* fixup padding ([612dd0c](https://github.com/adobe/spectrum-css/commit/612dd0c))
* implement t-shirt sizing for Action Button, closes [#936](https://github.com/adobe/spectrum-css/issues/936) ([1a9ecf6](https://github.com/adobe/spectrum-css/commit/1a9ecf6))
* use postcss-remap vars to get t-shirt sizing ([f24f6b3](https://github.com/adobe/spectrum-css/commit/f24f6b3))


### 🐛 Bug fixes

* correct padding, this one is complicated! ([f535f4b](https://github.com/adobe/spectrum-css/commit/f535f4b))
* correct variable usage ([12d3454](https://github.com/adobe/spectrum-css/commit/12d3454))
* hold icon distance until it's updated in DNA ([046ae8e](https://github.com/adobe/spectrum-css/commit/046ae8e))
* line-height of buttons ([eeb24b0](https://github.com/adobe/spectrum-css/commit/eeb24b0))
* remove hack for broken small min-width ([b8cbfbd](https://github.com/adobe/spectrum-css/commit/b8cbfbd))
* try to fix padding (still wrong for icon + label) ([8a2696e](https://github.com/adobe/spectrum-css/commit/8a2696e))


### 🛑 BREAKING CHANGES

* require hold icon to come before workflow icon
* .spectrum-ActionButton is no longer part of the button component, use the actionbutton component
