# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

<a name="3.0.3"></a>
## 3.0.3
🗓 2021-04-22 • 📝 [Commits](https://github.com/adobe/spectrum-css/compare/@spectrum-css/button@3.0.2...@spectrum-css/button@3.0.3)

### 🐛 Bug fixes

* refine the focus indicator per spectrum ([094e115](https://github.com/adobe/spectrum-css/commit/094e115))





<a name="3.0.2"></a>
## 3.0.2
🗓 2021-04-15 • 📝 [Commits](https://github.com/adobe/spectrum-css/compare/@spectrum-css/button@3.0.1...@spectrum-css/button@3.0.2)

**Note:** Version bump only for package @spectrum-css/button





<a name="3.0.1"></a>
## 3.0.1
🗓 2021-03-10 • 📝 [Commits](https://github.com/adobe/spectrum-css/compare/@spectrum-css/button@3.0.0...@spectrum-css/button@3.0.1)

**Note:** Version bump only for package @spectrum-css/button





<a name="3.0.0"></a>
# 3.0.0
🗓 2021-02-02 • 📝 [Commits](https://github.com/adobe/spectrum-css/compare/@spectrum-css/button@3.0.0-beta.6...@spectrum-css/button@3.0.0)

**Note:** Version bump only for package @spectrum-css/button





<a name="3.0.0-beta.6"></a>
# 3.0.0-beta.6
🗓 2020-12-04 • 📝 [Commits](https://github.com/adobe/spectrum-css/compare/@spectrum-css/button@3.0.0-beta.5...@spectrum-css/button@3.0.0-beta.6)

### ✨ Features

* button t-shirt sizing ([643c1bf](https://github.com/adobe/spectrum-css/commit/643c1bf))
* fixup padding ([612dd0c](https://github.com/adobe/spectrum-css/commit/612dd0c))
* implement t-shirt sizing for Action Button, closes [#936](https://github.com/adobe/spectrum-css/issues/936) ([1a9ecf6](https://github.com/adobe/spectrum-css/commit/1a9ecf6))
* remove FieldButton, fix Button ([44026f8](https://github.com/adobe/spectrum-css/commit/44026f8))
* t-shirt sizing for Button, closes [#938](https://github.com/adobe/spectrum-css/issues/938) ([7d9b1d1](https://github.com/adobe/spectrum-css/commit/7d9b1d1))


### 🐛 Bug fixes

* add back missing Button focus-ring ([bfe3692](https://github.com/adobe/spectrum-css/commit/bfe3692))
* correct height of small Button ([2221e0a](https://github.com/adobe/spectrum-css/commit/2221e0a))
* missing token used by SplitButton ([0828cb1](https://github.com/adobe/spectrum-css/commit/0828cb1))
* override Button font-weight while we wait for it to be fixed in DNA ([7ffd05a](https://github.com/adobe/spectrum-css/commit/7ffd05a))
* remove Button font-weight hack ([5261e40](https://github.com/adobe/spectrum-css/commit/5261e40))
* unbreak the build for SplitButton ([7c98dd5](https://github.com/adobe/spectrum-css/commit/7c98dd5))
* update main, resolved conflicts ([d7880a2](https://github.com/adobe/spectrum-css/commit/d7880a2))


### 🛑 BREAKING CHANGES

* .spectrum-FieldButton has been removed, use .spectrum-ActionButton instead
* t-shirt size must be added for button to work (i.e. .spectrum-Button--sizeM)
* .spectrum-ActionButton is no longer part of the button component, use the actionbutton component





<a name="3.0.0-beta.5"></a>
# 3.0.0-beta.5
🗓 2020-10-20 • 📝 [Commits](https://github.com/adobe/spectrum-css/compare/@spectrum-css/button@3.0.0-beta.4...@spectrum-css/button@3.0.0-beta.5)

**Note:** Version bump only for package @spectrum-css/button





<a name="3.0.0-beta.4"></a>
# 3.0.0-beta.4
🗓 2020-09-23 • 📝 [Commits](https://github.com/adobe/spectrum-css/compare/@spectrum-css/button@3.0.0-beta.3...@spectrum-css/button@3.0.0-beta.4)

### 🐛 Bug fixes

* actionButton focus-ring active state visual issue [#755](https://github.com/adobe/spectrum-css/issues/755) ([#777](https://github.com/adobe/spectrum-css/issues/777)) ([64af508](https://github.com/adobe/spectrum-css/commit/64af508))
* fix the issues caused by component rename ([#778](https://github.com/adobe/spectrum-css/issues/778)) ([e1d180c](https://github.com/adobe/spectrum-css/commit/e1d180c))
* removed deprecated tokens in button ([281027d](https://github.com/adobe/spectrum-css/commit/281027d))
* resolving conflicts with main ([8cafffa](https://github.com/adobe/spectrum-css/commit/8cafffa))
* wip fix more components ([b74dbb8](https://github.com/adobe/spectrum-css/commit/b74dbb8))
* workflow icon size change to medium ([#917](https://github.com/adobe/spectrum-css/issues/917)) ([a609ee6](https://github.com/adobe/spectrum-css/commit/a609ee6))





<a name="3.0.0-beta.3"></a>
# 3.0.0-beta.3
🗓 2020-06-19 • 📝 [Commits](https://github.com/adobe/spectrum-css/compare/@spectrum-css/button@3.0.0-beta.2...@spectrum-css/button@3.0.0-beta.3)

### 🐛 Bug fixes

* correct OverBackground ClearButton focus-ring, fixes [#730](https://github.com/adobe/spectrum-css/issues/730) ([#733](https://github.com/adobe/spectrum-css/issues/733)) ([5a34fa4](https://github.com/adobe/spectrum-css/commit/5a34fa4))





<a name="3.0.0-beta.2"></a>
# 3.0.0-beta.2
🗓 2020-05-14 • 📝 [Commits](https://github.com/adobe/spectrum-css/compare/@spectrum-css/button@3.0.0-beta.1...@spectrum-css/button@3.0.0-beta.2)

* Button Breaking Changes (#649) ([abf116b](https://github.com/adobe/spectrum-css/commit/abf116b)), closes [#649](https://github.com/adobe/spectrum-css/issues/649) [#519](https://github.com/adobe/spectrum-css/issues/519) [#620](https://github.com/adobe/spectrum-css/issues/620) [#606](https://github.com/adobe/spectrum-css/issues/606)


### 🛑 BREAKING CHANGES

* Tool button has been removed

* fix: interaction on mobile, text select

* feat: add Emphasized Action Button

* docs: add exampes for Quiet Emphasized Action Button

fix: correct Quiet Emphasized Action Button

* feat: button group
* Button group no longer supports Action Button, just normal buttons
* Margins have been removed from adjacent buttons. Use ButtonGroup instead.





<a name="3.0.0-beta.1"></a>
# 3.0.0-beta.1
🗓 2020-03-12 • 📝 [Commits](https://github.com/adobe/spectrum-css/compare/@spectrum-css/button@3.0.0-beta.0...@spectrum-css/button@3.0.0-beta.1)

**Note:** Version bump only for package @spectrum-css/button





<a name="3.0.0-beta.0"></a>
# 3.0.0-beta.0
🗓 2020-03-09 • 📝 [Commits](https://github.com/adobe/spectrum-css/compare/@spectrum-css/button@2.2.0...@spectrum-css/button@3.0.0-beta.0)

### ✨ Features

* make Button support RTL ([0f5aa5c](https://github.com/adobe/spectrum-css/commit/0f5aa5c))





<a name="2.2.0"></a>
# 2.2.0
🗓 2020-03-06 • 📝 [Commits](https://github.com/adobe/spectrum-css/compare/@spectrum-css/button@2.1.0...@spectrum-css/button@2.2.0)

### ✨ Features

* halo focus ring, closes [#112](https://github.com/adobe/spectrum-css/issues/112), closes [#573](https://github.com/adobe/spectrum-css/issues/573) ([#603](https://github.com/adobe/spectrum-css/issues/603)) ([d87e9a5](https://github.com/adobe/spectrum-css/commit/d87e9a5)), closes [#619](https://github.com/adobe/spectrum-css/issues/619)





<a name="2.1.0"></a>
# 2.1.0
🗓 2020-02-10 • 📝 [Commits](https://github.com/adobe/spectrum-css/compare/@spectrum-css/button@2.0.3...@spectrum-css/button@2.1.0)

### ✨ Features

* adding t-shirt sized typography, fixes [#210](https://github.com/adobe/spectrum-css/issues/210), closes [#416](https://github.com/adobe/spectrum-css/issues/416) ([#408](https://github.com/adobe/spectrum-css/issues/408)) ([3921bcb](https://github.com/adobe/spectrum-css/commit/3921bcb)), closes [#523](https://github.com/adobe/spectrum-css/issues/523)


### 🐛 Bug fixes

* adjust Button text alignment, fixes [#516](https://github.com/adobe/spectrum-css/issues/516) ([7f36619](https://github.com/adobe/spectrum-css/commit/7f36619))





<a name="2.0.3"></a>
## 2.0.3
🗓 2019-12-14 • 📝 [Commits](https://github.com/adobe/spectrum-css/compare/@spectrum-css/button@2.0.2...@spectrum-css/button@2.0.3)

**Note:** Version bump only for package @spectrum-css/button





<a name="2.0.2"></a>
## 2.0.2
🗓 2019-11-08 • 📝 [Commits](https://github.com/adobe/spectrum-css/compare/@spectrum-css/button@2.0.1...@spectrum-css/button@2.0.2)

**Note:** Version bump only for package @spectrum-css/button





<a name="2.0.1"></a>
## 2.0.1
🗓 2019-11-07 • 📝 [Commits](https://github.com/adobe/spectrum-css/compare/@spectrum-css/button@2.0.0...@spectrum-css/button@2.0.1)

**Note:** Version bump only for package @spectrum-css/button





<a name="2.0.0"></a>
# 2.0.0
🗓 2019-10-08

### ✨ Features

* move to individually versioned packages with Lerna ([#265](https://github.com/adobe/spectrum-css/issues/265)) ([cb7fd4b](https://github.com/adobe/spectrum-css/commit/cb7fd4b)), closes [#231](https://github.com/adobe/spectrum-css/issues/231) [#214](https://github.com/adobe/spectrum-css/issues/214) [#229](https://github.com/adobe/spectrum-css/issues/229) [#240](https://github.com/adobe/spectrum-css/issues/240) [#239](https://github.com/adobe/spectrum-css/issues/239) [#161](https://github.com/adobe/spectrum-css/issues/161) [#242](https://github.com/adobe/spectrum-css/issues/242) [#246](https://github.com/adobe/spectrum-css/issues/246) [#219](https://github.com/adobe/spectrum-css/issues/219) [#235](https://github.com/adobe/spectrum-css/issues/235) [#189](https://github.com/adobe/spectrum-css/issues/189) [#248](https://github.com/adobe/spectrum-css/issues/248) [#232](https://github.com/adobe/spectrum-css/issues/232) [#248](https://github.com/adobe/spectrum-css/issues/248) [#218](https://github.com/adobe/spectrum-css/issues/218) [#237](https://github.com/adobe/spectrum-css/issues/237) [#255](https://github.com/adobe/spectrum-css/issues/255) [#256](https://github.com/adobe/spectrum-css/issues/256) [#258](https://github.com/adobe/spectrum-css/issues/258) [#257](https://github.com/adobe/spectrum-css/issues/257) [#259](https://github.com/adobe/spectrum-css/issues/259)
