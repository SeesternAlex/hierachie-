-- Tabelle für Bundesheer Rollen
CREATE TABLE rollen (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  parentid INTEGER,
  CONSTRAINT fk_parent
    FOREIGN KEY(parentid) 
    REFERENCES rollen(id) 
    ON DELETE SET NULL
);

-- Beispiel-Datensätze, IDs werden explizit gesetzt für Parent-Verweise
INSERT INTO rollen (id, name, parentid) VALUES
(1, 'Bundespräsident (Oberbefehlshaber)', NULL),
(2, 'Bundesminister für Landesverteidigung', 1),
(3, 'Chef des Generalstabes', 2),
(4, 'Kommandant Streitkräftekommando', 3),
(5, 'Brigadekommandant', 4),
(6, 'Regimentskommandant', 5),
(7, 'Kompaniekommandant (Hauptmann)', 6),
(8, 'Oberleutnant', 7),
(9, 'Zugskommandant (Leutnant)', 7),
(10, 'Gruppenkommandant (Wachtmeister)', 8),
(11, 'Oberfeldwebel', 10),
(12, 'Feldwebel', 11),
(13, 'Stabswachtmeister', 12),
(14, 'Oberstabswachtmeister', 13),
(15, 'Stabsunteroffizier', 14),
(16, 'Hauptfeldwebel', 15),
(17, 'Major', 6),
(18, 'Oberstleutnant', 6),
(19, 'Oberst', 5),
(20, 'Brigadier', 4),
(21, 'Generalmajor', 3),
(22, 'Generalleutnant', 3),
(23, 'General', 3),
(24, 'Soldat (Gefreiter)', 25),
(25, 'Rekrut', 10),
(26, 'Zugsführer', 25),
(27, 'Obergefreiter', 25),
(28, 'Sanitäter', 10),
(29, 'Pionier', 10),
(30, 'Logistiker', 10),
(31, 'Vizeleutnant', 9),
(32, 'Oberstabsleutnant', 18),
(33, 'Leutnant', 9),
(34, 'Fahnenjunker', 33),
(35, 'Generalstabsarzt', 3),
(36, 'Militärkommandant', 5),
(37, 'Milizführer', 6),
(38, 'Hangarchef (Luftstreitkräfte)', 6),
(39, 'Fliegeroffizier', 8),
(40, 'Technikoffizier', 7),
(41, 'Cyberabwehr Spezialist', 10);
