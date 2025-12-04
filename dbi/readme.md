# Bundesheer-Diagramm Baumgenerator - Anleitung

Dieses Node.js-Skript erzeugt ein SVG- und PNG-Bild der militärischen Hierarchie (Baumstruktur).

## Voraussetzungen

- Linux-Betriebssystem (getestet auf Ubuntu/Debian, sollte aber überall funktionieren)  
- Aktuelle Node.js-Version (empfohlen >= 14)  
- Installierte npm-Paketverwaltung  
- Paket: sharp für die Bildkonvertierung  
- PostgreSQL-Datenbank (wenn du Datenbankanbindung nutzen möchtest)

## Installation & Vorbereitung

### 1. Node.js installieren (falls noch nicht vorhanden)

sudo apt update  
sudo apt install nodejs npm  
node --version  
npm --version  

## .env extension installieren (falls noch nicht vorhanden)
npm install dotenv

## env in .env umwandeln (falls noch nicht gemacht)
mv env .env


### 2. Projektordner erstellen und Skript ablegen


mkdir bundesheer-baum  
cd bundesheer-baum  
nano baum.js  

Füge deinen Code in die Datei `hierachie.js` / `hierachie_mit_db_login.js` ein und speichere sie.

### 3. Benötigte Pakete installieren


npm install sharp pg


*Optional:* Falls dein System kein `require('fs')` zulässt, bedeutet das, dass Node.js nicht korrekt installiert ist. `fs` ist ein integriertes Modul.

### 4. PostgreSQL-Datenbank einrichten (Optional, falls Datenbankanbindung)

Falls du die Daten aus der Datenbank abfragen möchtest, lege zunächst die Tabelle mit folgendem SQL-Skript an:

Speichere die nachfolgende Datei als `schema.sql`:

Importiere dieses SQL-Skript in deine PostgreSQL-Datenbank mit:


psql -U dein_user -d deine_datenbank -f schema.sql


Passe `dein_user` und `deine_datenbank` an deine lokale Konfiguration an.

### 5. Skript ausführen


node baum.js


Wenn alles funktioniert, werden die Dateien `tree.svg` und `tree.png` im selben Ordner erzeugt.

## Anpassungen & Tipps

- Passe bei Bedarf das `rollen`-Array im Skript an, falls du keine DB verwendest.
- Verwende `generateSVG`-Parameter für Layoutanpassungen.
- Die erzeugten Diagramme im SVG- und PNG-Format lassen sich in Browsern oder Bildbetrachtern öffnen.

## Häufige Fehler

- Sharp Modulpaket nicht installiert → `npm install sharp`
- Node.js nicht installiert oder veraltet
- PostgreSQL-Zugangsdaten falsch konfiguriert (wenn Datenbank verwendet wird)

