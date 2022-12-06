<p align="center">
  <a href="https://www.budibase.com">
    <img alt="Budibase" src="https://d33wubrfki0l68.cloudfront.net/aac32159d7207b5085e74a7ef67afbb7027786c5/2b1fd/img/logo/bb-emblem.svg" width="60" />
  </a>
</p>
<h1 align="center">
  Budibase
</h1>

<h3 align="center">
  Entwickle, automatisiere und stelle interne Tools in Minuten bereit.
</h3>
<p align="center">
  Budibase ist eine quelloffene Low-Code Plattform, die es Entwicklern und IT-Profis ermöglicht interne Tools auf eigener Infrastruktur zu entwickeln, zu automatisieren und bereitzustellen.
</p>

<h3 align="center">
 🤖 🎨 🚀
</h3>

<p align="center">
  <img alt="Budibase design ui" src="https://i.imgur.com/5BnXPsN.png">
</p>

<p align="center">
  <a href="https://github.com/Budibase/budibase/releases">
    <img alt="GitHub all releases" src="https://img.shields.io/github/downloads/Budibase/budibase/total">
  </a>
  <a href="https://github.com/Budibase/budibase/releases">
    <img alt="GitHub release (latest by date)" src="https://img.shields.io/github/v/release/Budibase/budibase">
  </a>
  <a href="https://twitter.com/intent/follow?screen_name=budibase">
    <img src="https://img.shields.io/twitter/follow/budibase?style=social" alt="Follow @budibase" />
  </a>
  <img src="https://img.shields.io/badge/Contributor%20Covenant-v2.0%20adopted-ff69b4.svg" alt="Code of conduct" />
  <a href="https://codecov.io/gh/Budibase/budibase">
    <img src="https://codecov.io/gh/Budibase/budibase/graph/badge.svg?token=E8W2ZFXQOH"/>
  </a>
</p>

<h3 align="center">
  <a href="https://docs.budibase.com/docs/quickstart-tutorials">Los Geht's</a>
  <span> · </span>
  <a href="https://docs.budibase.com">Dokumentation</a>
  <span> · </span>
  <a href="https://github.com/Budibase/budibase/discussions?discussions_q=category%3AIdeas">Featureanfrage</a>
  <span> · </span>
  <a href="https://github.com/Budibase/budibase/issues">Einen Bug melden</a>
  <span> · </span>
  Support: <a href="https://github.com/Budibase/budibase/discussions">Github Discussions</a>
</h3>

<br /><br />
## ✨ Features

- **Entwickle echte Webanwendungen.** Anders als ähnliche Plattformen entwickelst du mit Budibase echte Single-Page Webapplikationen (SPAs). Deine Budibase-Apps sind standardmäßig hochperformant und haben ein Responsive-Design für eine großartige Benutzererfahrung.

- **Quelloffen und erweiterbar.** Budibase ist quelloffen - lizenziert unter der GPL v3. Du kannst darauf vertrauen, dass Budibase auch in der Zukunft immer zur Verfügung steht. Budibase bietet eine Entwicklerfreundliche Plattform: du kannst Budibase erweitern, oder die Codebase forken und eigene Änderungen vornehmen.

- **Datenquellen einbinden oder von Null starten.** Budibase kann Daten aus vielen Quellen einbinden, unter anderem aus MongoDB, CouchDB, PostgreSQL, MySQL, Airtable, S3, DynamoDB, oder einer REST API. Und anders als ähnliche Plattformen erlaubt Budibase auch die App-Entwicklung komplett ohne Datenquellen mit einer internen Datenbank. Deine Datenquelle noch nicht dabei? [Frag einfach nach](https://github.com/Budibase/budibase/discussions?discussions_q=category%3AIdeas).

- **Designe und entwickle Apps mit leistungsfähigen Komponenten.** Budibase kommt fertig mit optisch ansprechenden und leistungsfähigen Komponenten, die als Bausteine für deine UI dienen. Außerdem kannst du die UI mit vielen CSS-Styles nach deinem Geschmack anpassen. Fehlt dir eine Komponente? [Frag uns hier](https://github.com/Budibase/budibase/discussions?discussions_q=category%3AIdeas).

- **Automatisiere Prozesse, integriere andere Tools und binde Web-APIs ein.** Spar dir Zeit, indem du manuelle Prozesse einfach automatisierst: Vom Verbinden mit Web-Hooks bis zum automatischen Senden von E-Mails, Budibase kann alles für dich erledigen. Eine Automatisierung ist noch nicht dabei? Du kannst einfach [deine eigene erstellen](https://github.com/Budibase/automations) oder [uns deine Idee mitteilen](https://github.com/Budibase/budibase/discussions?discussions_q=category%3AIdeas).

- **Ein Paradies für Systemadministratoren** Budibase ist von Grund auf für das Skalieren ausgelegt. Du kannst Budibase einfach auf deiner eigenen Infrastruktur hosten und global Benutzer, Onboarding, SMTP, Applikationen, Gruppen, UI-Themes und mehr verwalten. Du kannst außerdem ein übersichtliches App-Portal für deine Benutzer bereitstellen und das Benutzermanagement an Gruppen-Manager delegieren.

<br />

---

<br />

## 🏁 Los geht's
Momentan existieren zwei Optionen mit Budibase loszulegen: Digital Ocean und Docker.
<br /><br />

### Los geht's mit Digital Ocean
Der einfachste und schnellste Weg loszulegen ist Digital Ocean:
<a href="https://marketplace.digitalocean.com/apps/budibase">1-Click Deploy auf Digital Ocean</a>

<a href="https://marketplace.digitalocean.com/apps/budibase">
  <img src="https://user-images.githubusercontent.com/552074/87779219-5c3b7600-c824-11ea-9898-981a8ba94f6c.png" alt="digital ocean badge">
</a>  
<br /><br />

### Los geht's mit Docker
Um loszulegen musst du bereits `docker` und `docker compose` auf deinem Computer installiert haben.
Sobald du Docker installiert hast brauchst du ca. 5 Minuten für diese 4 Schritte:

1. Installiere das Budibase CLI Tool.
```
$ npm i -g @budibase/cli 
```


2. Installiere Budibase (wähle den Speicherort und den Port auf dem Budibase laufen soll.)
```
$ budi hosting --init 
```


3. Führe Budibase aus.
```
$ budi hosting --start 
```


4. Lege einen Admin-Benutzer an.
Gib die E-Mail und das Passwort für den neuen Admin-Benutzer ein.

Schon geschafft! Jetzt kann es losgehen mit der minutenschnellen Entwicklung deiner Tools. Für weitere Informationen und Tipps schau doch mal in unsere [Dokumentation](https://docs.budibase.com/docs/quickstart-tutorials).

<br />

---

<br />

## 🎓 Budibase lernen

Die Budibase Dokumentation [findest du hier](https://docs.budibase.com).
<br />

---

<br /><br />

## 💬 Community

Wenn du eine Frage hast, oder dich mit anderen Budibase-Nutzern unterhalten willst, schau doch mal in unsere
[Github Discussions](https://github.com/Budibase/budibase/discussions).

<img src="https://d33wubrfki0l68.cloudfront.net/e9241201fd89f9abbbdaac4fe44bb16312752abe/84013/img/hero-images/community.webp" />

<br /><br />

---

<br />

## ❗ Verhaltenskodex

Budibase steht für eine einladende und vielfältige Community frei von Belästigung. Wir erwarten dass sich jeder in der Budibase-Community an unseren [**Verhaltenskodex**](https://github.com/Budibase/budibase/blob/HEAD/.github/CODE_OF_CONDUCT.md) hält. Bitte les ihn dir durch.
<br />

---

<br />

## 🙌 Zu Budibase beitragen

Von einem gemeldeten Bug bis zum Erstellen einer Pull-Request: wir schätzen jeden Beitrag. Wenn du ein neues Feature implementieren willst oder eine Änderung an der API vornehmen willst, erstelle bitte zuerst ein Issue. So können wir sicherstellen, dass deine Arbeit nicht umsonst ist.

### Unsicher wo du anfangen sollst?
Gute Ideen für erste Beiträge zum Projekt [findest du hier](https://github.com/Budibase/budibase/projects/22).

### Wie die Repository strukturiert ist.
Budibase ist eine Monorepo, die von Lerna verwaltet wird. Lerna verwaltet das Erstellen und Veröffentlichen von Budibase-Paketen.
Grob besteht Budibase aus folgenden Modulen:

- [packages/builder](https://github.com/Budibase/budibase/tree/HEAD/packages/builder) - enthält Code für den clientseitigen Budibase Builder, mit dem Anwendungen erstellt werden.

- [packages/client](https://github.com/Budibase/budibase/tree/HEAD/packages/client) - Ein Modul, das im Browser läuft und aus JSON-Definitionen funktionsfähige Web-Apps erstellt.

- [packages/server](https://github.com/Budibase/budibase/tree/HEAD/packages/server) - Der Budibase Server. Diese Koa-Anwendung stellt den Javascript-Code für den Builder und den Client bereit, und bietet eine API für die Interaktion mit dem Budibase Backend, Datenbanken und dem Dateisystem.

Für mehr Informationen schau in die [CONTRIBUTING.md](https://github.com/Budibase/budibase/blob/HEAD/.github/CONTRIBUTING.md)
<br /><br />

---

<br /><br />

## 📝 Lizenz

Budibase ist quelloffen, lizenziert unter der [GPL v3](https://www.gnu.org/licenses/gpl-3.0.en.html). Die Client- und Komponentenbibliotheken sind unter der [MPL](https://directory.fsf.org/wiki/License:MPL-2.0) lizenziert, damit du deine erstellten Apps unter deine präferierte Lizenz stellen kannst.
<br /><br />

---


<br />

## ⭐ Github-Sterne im Verlauf der Zeit

[![Stargazers over time](https://starchart.cc/Budibase/budibase.svg)](https://starchart.cc/Budibase/budibase)

Wenn du zwischen Updates des Builders Probleme auftreten, lies bitte den Guide [hier](https://github.com/Budibase/budibase/blob/HEAD/.github/CONTRIBUTING.md#troubleshooting), um deine Umgebung zurückzusetzen.

<br />

---

<br /><br />

## Mitwirkende ✨

Vielen Dank an alle wundervollen Menschen, die zu Budibase beigetragen haben ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="http://martinmck.com"><img src="https://avatars1.githubusercontent.com/u/11256663?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Martin McKeaveney</b></sub></a><br /><a href="https://github.com/Budibase/budibase/commits?author=shogunpurple" title="Code">💻</a> <a href="https://github.com/Budibase/budibase/commits?author=shogunpurple" title="Documentation">📖</a> <a href="https://github.com/Budibase/budibase/commits?author=shogunpurple" title="Tests">⚠️</a> <a href="#infra-shogunpurple" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a></td>
    <td align="center"><a href="http://www.michaeldrury.co.uk/"><img src="https://avatars2.githubusercontent.com/u/4407001?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Michael Drury</b></sub></a><br /><a href="https://github.com/Budibase/budibase/commits?author=mike12345567" title="Documentation">📖</a> <a href="https://github.com/Budibase/budibase/commits?author=mike12345567" title="Code">💻</a> <a href="https://github.com/Budibase/budibase/commits?author=mike12345567" title="Tests">⚠️</a> <a href="#infra-mike12345567" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a></td>
    <td align="center"><a href="https://github.com/aptkingston"><img src="https://avatars3.githubusercontent.com/u/9075550?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Andrew Kingston</b></sub></a><br /><a href="https://github.com/Budibase/budibase/commits?author=aptkingston" title="Documentation">📖</a> <a href="https://github.com/Budibase/budibase/commits?author=aptkingston" title="Code">💻</a> <a href="https://github.com/Budibase/budibase/commits?author=aptkingston" title="Tests">⚠️</a> <a href="#design-aptkingston" title="Design">🎨</a></td>
    <td align="center"><a href="https://budibase.com/"><img src="https://avatars3.githubusercontent.com/u/3524181?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Michael Shanks</b></sub></a><br /><a href="https://github.com/Budibase/budibase/commits?author=mjashanks" title="Documentation">📖</a> <a href="https://github.com/Budibase/budibase/commits?author=mjashanks" title="Code">💻</a> <a href="https://github.com/Budibase/budibase/commits?author=mjashanks" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/kevmodrome"><img src="https://avatars3.githubusercontent.com/u/534488?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Kevin Åberg Kultalahti</b></sub></a><br /><a href="https://github.com/Budibase/budibase/commits?author=kevmodrome" title="Documentation">📖</a> <a href="https://github.com/Budibase/budibase/commits?author=kevmodrome" title="Code">💻</a> <a href="https://github.com/Budibase/budibase/commits?author=kevmodrome" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://www.budibase.com/"><img src="https://avatars2.githubusercontent.com/u/49767913?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Joe</b></sub></a><br /><a href="https://github.com/Budibase/budibase/commits?author=joebudi" title="Documentation">📖</a> <a href="https://github.com/Budibase/budibase/commits?author=joebudi" title="Code">💻</a> <a href="#content-joebudi" title="Content">🖋</a> <a href="#design-joebudi" title="Design">🎨</a></td>
    <td align="center"><a href="https://github.com/Rory-Powell"><img src="https://avatars.githubusercontent.com/u/8755148?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Rory Powell</b></sub></a><br /><a href="https://github.com/Budibase/budibase/commits?author=Rory-Powell" title="Code">💻</a> <a href="https://github.com/Budibase/budibase/commits?author=Rory-Powell" title="Documentation">📖</a> <a href="https://github.com/Budibase/budibase/commits?author=Rory-Powell" title="Tests">⚠️</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/PClmnt"><img src="https://avatars.githubusercontent.com/u/5665926?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Peter Clement</b></sub></a><br /><a href="https://github.com/Budibase/budibase/commits?author=PClmnt" title="Code">💻</a> <a href="https://github.com/Budibase/budibase/commits?author=PClmnt" title="Documentation">📖</a> <a href="https://github.com/Budibase/budibase/commits?author=PClmnt" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/Conor-Mack"><img src="https://avatars1.githubusercontent.com/u/36074859?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Conor_Mack</b></sub></a><br /><a href="https://github.com/Budibase/budibase/commits?author=Conor-Mack" title="Code">💻</a> <a href="https://github.com/Budibase/budibase/commits?author=Conor-Mack" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/pngwn"><img src="https://avatars1.githubusercontent.com/u/12937446?v=4?s=100" width="100px;" alt=""/><br /><sub><b>pngwn</b></sub></a><br /><a href="https://github.com/Budibase/budibase/commits?author=pngwn" title="Code">💻</a> <a href="https://github.com/Budibase/budibase/commits?author=pngwn" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/HugoLd"><img src="https://avatars0.githubusercontent.com/u/26521848?v=4?s=100" width="100px;" alt=""/><br /><sub><b>HugoLd</b></sub></a><br /><a href="https://github.com/Budibase/budibase/commits?author=HugoLd" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/victoriasloan"><img src="https://avatars.githubusercontent.com/u/9913651?v=4?s=100" width="100px;" alt=""/><br /><sub><b>victoriasloan</b></sub></a><br /><a href="https://github.com/Budibase/budibase/commits?author=victoriasloan" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/yashank09"><img src="https://avatars.githubusercontent.com/u/37672190?v=4?s=100" width="100px;" alt=""/><br /><sub><b>yashank09</b></sub></a><br /><a href="https://github.com/Budibase/budibase/commits?author=yashank09" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/SOVLOOKUP"><img src="https://avatars.githubusercontent.com/u/53158137?v=4?s=100" width="100px;" alt=""/><br /><sub><b>SOVLOOKUP</b></sub></a><br /><a href="https://github.com/Budibase/budibase/commits?author=SOVLOOKUP" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/seoulaja"><img src="https://avatars.githubusercontent.com/u/15101654?v=4?s=100" width="100px;" alt=""/><br /><sub><b>seoulaja</b></sub></a><br /><a href="#translation-seoulaja" title="Translation">🌍</a></td>
    <td align="center"><a href="https://github.com/mslourens"><img src="https://avatars.githubusercontent.com/u/1907152?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Maurits Lourens</b></sub></a><br /><a href="https://github.com/Budibase/budibase/commits?author=mslourens" title="Tests">⚠️</a> <a href="https://github.com/Budibase/budibase/commits?author=mslourens" title="Code">💻</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/Rory-Powell"><img src="https://avatars.githubusercontent.com/u/8755148?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Rory Powell</b></sub></a><br /><a href="#infra-Rory-Powell" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="https://github.com/Budibase/budibase/commits?author=Rory-Powell" title="Tests">⚠️</a> <a href="https://github.com/Budibase/budibase/commits?author=Rory-Powell" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

Dieses Projekt folgt der [All-Contributors](https://github.com/all-contributors/all-contributors) Spezifikation. Wir heißen Beiträge aller Art willkommen!
