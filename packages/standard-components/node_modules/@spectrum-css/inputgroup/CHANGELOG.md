# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

<a name="3.0.3"></a>
## 3.0.3
🗓 2021-04-22 • 📝 [Commits](https://github.com/adobe/spectrum-css/compare/@spectrum-css/inputgroup@3.0.2...@spectrum-css/inputgroup@3.0.3)

**Note:** Version bump only for package @spectrum-css/inputgroup





<a name="3.0.2"></a>
## 3.0.2
🗓 2021-04-15 • 📝 [Commits](https://github.com/adobe/spectrum-css/compare/@spectrum-css/inputgroup@3.0.1...@spectrum-css/inputgroup@3.0.2)

**Note:** Version bump only for package @spectrum-css/inputgroup





<a name="3.0.1"></a>
## 3.0.1
🗓 2021-03-10 • 📝 [Commits](https://github.com/adobe/spectrum-css/compare/@spectrum-css/inputgroup@3.0.0...@spectrum-css/inputgroup@3.0.1)

**Note:** Version bump only for package @spectrum-css/inputgroup





<a name="3.0.0"></a>
# 3.0.0
🗓 2021-02-02 • 📝 [Commits](https://github.com/adobe/spectrum-css/compare/@spectrum-css/inputgroup@3.0.0-beta.7...@spectrum-css/inputgroup@3.0.0)

### ✨ Features

* added t-shirt sizes to picker ([35bf08f](https://github.com/adobe/spectrum-css/commit/35bf08f)), closes [#940](https://github.com/adobe/spectrum-css/issues/940)





<a name="3.0.0-beta.7"></a>
# 3.0.0-beta.7
🗓 2020-12-04 • 📝 [Commits](https://github.com/adobe/spectrum-css/compare/@spectrum-css/inputgroup@3.0.0-beta.6...@spectrum-css/inputgroup@3.0.0-beta.7)

### ✨ Features

* change all instances of .is-selected to .is-open ([e28af42](https://github.com/adobe/spectrum-css/commit/e28af42))
* refactor to use Picker ([402a155](https://github.com/adobe/spectrum-css/commit/402a155))
* replace all FieldButton with ActionButton ([2fcbaaf](https://github.com/adobe/spectrum-css/commit/2fcbaaf))
* use new Picker markup ([43909a4](https://github.com/adobe/spectrum-css/commit/43909a4))


### 🐛 Bug fixes

* add missing dependency on Action Button ([9d893f9](https://github.com/adobe/spectrum-css/commit/9d893f9))
* correct border on Quiet Combobox ([d3e860f](https://github.com/adobe/spectrum-css/commit/d3e860f))
* make InputGroup build again ([de9337a](https://github.com/adobe/spectrum-css/commit/de9337a))
* update main, resolved conflicts ([d7880a2](https://github.com/adobe/spectrum-css/commit/d7880a2))


### 🛑 BREAKING CHANGES

* Use .is-open to indicate the popover is shown, not .is-selected
* DatePicker pattern now uses Picker, not ActionButton
* now uses Picker markup
* markup now requires spectrum-ActionButton where all uses of spectrum-FieldButton were





<a name="3.0.0-beta.6"></a>
# 3.0.0-beta.6
🗓 2020-10-20 • 📝 [Commits](https://github.com/adobe/spectrum-css/compare/@spectrum-css/inputgroup@3.0.0-beta.5...@spectrum-css/inputgroup@3.0.0-beta.6)

**Note:** Version bump only for package @spectrum-css/inputgroup





<a name="3.0.0-beta.5"></a>
# 3.0.0-beta.5
🗓 2020-09-23 • 📝 [Commits](https://github.com/adobe/spectrum-css/compare/@spectrum-css/inputgroup@3.0.0-beta.4...@spectrum-css/inputgroup@3.0.0-beta.5)

### 🐛 Bug fixes

* change workflow icon size to medium for most of the examples ([#962](https://github.com/adobe/spectrum-css/issues/962)) ([db7b8b2](https://github.com/adobe/spectrum-css/commit/db7b8b2))
* removed deprecated tokens from searchWithin ([d97b026](https://github.com/adobe/spectrum-css/commit/d97b026))
* wip fix more components ([b74dbb8](https://github.com/adobe/spectrum-css/commit/b74dbb8))





<a name="3.0.0-beta.4"></a>
# 3.0.0-beta.4
🗓 2020-06-19 • 📝 [Commits](https://github.com/adobe/spectrum-css/compare/@spectrum-css/inputgroup@3.0.0-beta.3...@spectrum-css/inputgroup@3.0.0-beta.4)

**Note:** Version bump only for package @spectrum-css/inputgroup





<a name="3.0.0-beta.3"></a>
# 3.0.0-beta.3
🗓 2020-05-14 • 📝 [Commits](https://github.com/adobe/spectrum-css/compare/@spectrum-css/inputgroup@3.0.0-beta.2...@spectrum-css/inputgroup@3.0.0-beta.3)

**Note:** Version bump only for package @spectrum-css/inputgroup





<a name="3.0.0-beta.2"></a>
# 3.0.0-beta.2
🗓 2020-03-12 • 📝 [Commits](https://github.com/adobe/spectrum-css/compare/@spectrum-css/inputgroup@3.0.0-beta.1...@spectrum-css/inputgroup@3.0.0-beta.2)

**Note:** Version bump only for package @spectrum-css/inputgroup





<a name="3.0.0-beta.1"></a>
# 3.0.0-beta.1
🗓 2020-03-12 • 📝 [Commits](https://github.com/adobe/spectrum-css/compare/@spectrum-css/inputgroup@3.0.0-beta.0...@spectrum-css/inputgroup@3.0.0-beta.1)

### ✨ Features

* make InputGroup use new Textfield markup ([ef2d193](https://github.com/adobe/spectrum-css/commit/ef2d193)), closes [#224](https://github.com/adobe/spectrum-css/issues/224)


### 🛑 BREAKING CHANGES

* migrated to next Textfield markup
* .spectrum-InputGroup-textfield is now required on Textfields inside of InputGroup
* InputGroup must have .is-keyboardFocused and .is-focused when focused
* .spectrum-Datepicker--rangeDash renamed to .spectrum-Datepicker-rangeDash
* removed .spectrum-Datepicker-focusRing





<a name="3.0.0-beta.0"></a>
# 3.0.0-beta.0
🗓 2020-03-09 • 📝 [Commits](https://github.com/adobe/spectrum-css/compare/@spectrum-css/inputgroup@2.0.6...@spectrum-css/inputgroup@3.0.0-beta.0)

### ✨ Features

* make InputGroup support RTL ([d2ed152](https://github.com/adobe/spectrum-css/commit/d2ed152))





<a name="2.0.6"></a>
## 2.0.6
🗓 2020-03-06 • 📝 [Commits](https://github.com/adobe/spectrum-css/compare/@spectrum-css/inputgroup@2.0.5...@spectrum-css/inputgroup@2.0.6)

**Note:** Version bump only for package @spectrum-css/inputgroup





<a name="2.0.5"></a>
## 2.0.5
🗓 2020-02-10 • 📝 [Commits](https://github.com/adobe/spectrum-css/compare/@spectrum-css/inputgroup@2.0.4...@spectrum-css/inputgroup@2.0.5)

**Note:** Version bump only for package @spectrum-css/inputgroup





<a name="2.0.4"></a>
## 2.0.4
🗓 2020-01-23 • 📝 [Commits](https://github.com/adobe/spectrum-css/compare/@spectrum-css/inputgroup@2.0.3...@spectrum-css/inputgroup@2.0.4)

**Note:** Version bump only for package @spectrum-css/inputgroup





<a name="2.0.3"></a>
## 2.0.3
🗓 2019-12-14 • 📝 [Commits](https://github.com/adobe/spectrum-css/compare/@spectrum-css/inputgroup@2.0.2...@spectrum-css/inputgroup@2.0.3)

### 🐛 Bug fixes

* fix button width in InputGroup, fix DatePicker example, fixes [#399](https://github.com/adobe/spectrum-css/issues/399) ([#431](https://github.com/adobe/spectrum-css/issues/431)) ([bdd57f6](https://github.com/adobe/spectrum-css/commit/bdd57f6)), closes [#394](https://github.com/adobe/spectrum-css/issues/394)
* use endash for Date range picker, fixes [#440](https://github.com/adobe/spectrum-css/issues/440) ([41f8bb9](https://github.com/adobe/spectrum-css/commit/41f8bb9))





<a name="2.0.2"></a>
## 2.0.2
🗓 2019-11-08 • 📝 [Commits](https://github.com/adobe/spectrum-css/compare/@spectrum-css/inputgroup@2.0.1...@spectrum-css/inputgroup@2.0.2)

**Note:** Version bump only for package @spectrum-css/inputgroup





<a name="2.0.1"></a>
## 2.0.1
🗓 2019-11-07 • 📝 [Commits](https://github.com/adobe/spectrum-css/compare/@spectrum-css/inputgroup@2.0.0...@spectrum-css/inputgroup@2.0.1)

**Note:** Version bump only for package @spectrum-css/inputgroup





<a name="2.0.0"></a>
# 2.0.0
🗓 2019-10-08

### ✨ Features

* move to individually versioned packages with Lerna ([#265](https://github.com/adobe/spectrum-css/issues/265)) ([cb7fd4b](https://github.com/adobe/spectrum-css/commit/cb7fd4b)), closes [#231](https://github.com/adobe/spectrum-css/issues/231) [#214](https://github.com/adobe/spectrum-css/issues/214) [#229](https://github.com/adobe/spectrum-css/issues/229) [#240](https://github.com/adobe/spectrum-css/issues/240) [#239](https://github.com/adobe/spectrum-css/issues/239) [#161](https://github.com/adobe/spectrum-css/issues/161) [#242](https://github.com/adobe/spectrum-css/issues/242) [#246](https://github.com/adobe/spectrum-css/issues/246) [#219](https://github.com/adobe/spectrum-css/issues/219) [#235](https://github.com/adobe/spectrum-css/issues/235) [#189](https://github.com/adobe/spectrum-css/issues/189) [#248](https://github.com/adobe/spectrum-css/issues/248) [#232](https://github.com/adobe/spectrum-css/issues/232) [#248](https://github.com/adobe/spectrum-css/issues/248) [#218](https://github.com/adobe/spectrum-css/issues/218) [#237](https://github.com/adobe/spectrum-css/issues/237) [#255](https://github.com/adobe/spectrum-css/issues/255) [#256](https://github.com/adobe/spectrum-css/issues/256) [#258](https://github.com/adobe/spectrum-css/issues/258) [#257](https://github.com/adobe/spectrum-css/issues/257) [#259](https://github.com/adobe/spectrum-css/issues/259)
