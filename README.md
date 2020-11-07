# Feedibus

_Projekt von:_
_Simon Hanesch, Jan Hümmelink, Janek Lüdiger und Leon Schönhoff_

## Anforderungen
1. [node.js](https://nodejs.org/en/download/)
2. npm
3. Eine von [knex](http://knexjs.org) unterstützte Datenbank (Postgres, MSSQL, MySQL, MariaDB, SQLite3, Oracle oder Amazon Redshift )

## Installation

1. Kopiere das dieses Repository in das gewünschte Zielverzeichnis
2. Installiere das Programm mit dem Befehl `npm install`
3. Trage die gewünschten Konfigurationen in der *knexfile.js* und der*config.js*-Datei ein
4. Führe die Initiale Migration mit dem Befehl `knex migrate:up` aus
5. Baue die Frontend-Komponenten mit dem Befehl `webpack`
6. Starte das Programm mit dem Befehl `node app.js`

## Nachinstallation einer anderen Datenbank

Das Projekt wird standardmäßig mit dem *pg*-Treiber für 
die Datenbanken Postgres und Amazon Redshift installiert,
es funktioniert aber auch mit andere DBMS.
Dazu müssen ggf. die benötigten Treiber nachinstalliert werden.

| DBMS           | Treiber    | Installations Befehl   |
|----------------|------------|------------------------|
| SQLite3        | *sqlite3*  | `npm install sqlite3`  |
| MySQL/ MairaDB | *mysql2*   | `npm install mysql2`   |
| MSSQL          | *mssql*    | `npm install mssql`    |
| Oracle         | *oracledb* | `npm install oracledb` |

Anschließend müssen zudem die Datenbank-Einstellungen in der *knexfile.js*
entsprechend der [knex-Dokumentation](http://knexjs.org/#knexfile) angepasst werden.

## Befehle
Hier ist eine Übersicht der Befehle, die zum Arbeit mit dem Projekt nützlich sind:

* `npm install` (re-)installiert die Abhängigkeiten des Projektes
* `knex migrate:up` führt die unausgeführten Migrationen durch
* `webpack` baut die Frontend-Komponenten, wie sie in der webpack.config.js definiert sind
* `npm run lint` führt eine Codeanalyse entsprechende der Einstellungen in der .eslint.js Datei aus
* `npm run fix` versucht die Fehler der Codeanalyse zu beheben
* `node app.js` startet das Programm
* `nodemon app.js` startet das Programm initial und startet das Programm erneut, wenn eine Änderung des Sourcecodes entdeckt wird
